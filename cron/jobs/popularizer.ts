import { backOff } from "exponential-backoff";
import { ITUNES_STOREFRONTS, ITUNES_US_CATEGORY_IDS } from "../lib/itunes.ts";
import { getProxyUrl } from "../lib/constants.ts";
import { db } from "../db/index.ts";
import { showsTable } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";
import { processItunesId } from "../lib/processor.ts";

export const runPopularizerCron = async () => {
  console.log("Running popularizer cron job...");

  const uniqueIds = new Set<string>();

  for (const storeFront of ITUNES_STOREFRONTS) {
    for (const categoryId of ITUNES_US_CATEGORY_IDS) {
      // Looks like what triggers a block is parallel requests from the same IP
      let response;

      try {
        response = await backOff(
          () =>
            fetch(
              getProxyUrl(
                `https://itunes.apple.com/${storeFront}/rss/toppodcasts/limit=200/explicit=true/genre=${categoryId}/json`
              )
            ).then((res) => res.json()),
          {
            timeMultiple: 2,
            numOfAttempts: 5,
          }
        );
      } catch (e) {
        console.error("Failed to fetch", storeFront, categoryId, e);
        continue;
      }

      if (!response.feed.entry) {
        continue;
      }

      const entries = response.feed.entry.id ? [response.feed.entry] : response.feed.entry;

      for (const entry of entries) {
        const id = entry.id.attributes["im:id"];
        uniqueIds.add(id);
      }
    }
  }

  const idsArray = Array.from(uniqueIds);
  console.log(`Found ${idsArray.length} unique podcast IDs`);

  let notOnDb = 0;

  for (const id of idsArray) {
    const count = await db.$count(showsTable, eq(showsTable.source_id, id));
    if (count === 0) {
      notOnDb++;
      await processItunesId(id);
    } else {
      await db
        .update(showsTable)
        .set({ popularity: sql`${showsTable.popularity} + 1` })
        .where(eq(showsTable.source_id, id));
    }
  }

  console.log(`Popularizer done. ${notOnDb} podcasts not on DB.`);
};
