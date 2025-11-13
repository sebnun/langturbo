import { backOff } from "exponential-backoff";
import { ITUNES_STOREFRONTS, ITUNES_US_CATEGORY_IDS } from "../lib/itunes.ts";
import { db } from "../db/index.ts";
import { itunesTable, showsTable } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";
import { processItunesId } from "../lib/processor.ts";
import { getProxyUrl } from "../lib/utils.ts";

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
        console.error("Failed to fetch", storeFront, categoryId);
        continue;
      }

      if (!response.feed.entry) {
        //console.log('no feed entry', storeFront, categoryId)
        continue;
      }

      const entries = response.feed.entry.id ? [response.feed.entry] : response.feed.entry;

      for (const entry of entries) {
        const id = entry.id.attributes["im:id"];
        uniqueIds.add(id);
      }
    }
  }

  console.log(`Found ${uniqueIds.size} unique podcast IDs`);

  const notSeenIds = [];

  const seenItunesIdsRows = await db.select({ id: itunesTable.id }).from(itunesTable);
  const seenItunesIds = new Set(seenItunesIdsRows.map((sid) => sid.id));

  for (const id of uniqueIds) {
    const showRows = await db
      .select({ id: showsTable.id })
      .from(showsTable)
      .where(eq(showsTable.source_id, id))
      .limit(1);

    if (!showRows.length) {
      if (!seenItunesIds.has(id)) {
        await processItunesId(id);
        notSeenIds.push(id);
      }
    } else {
      await db
        .update(showsTable)
        .set({ popularity: sql`${showsTable.popularity} + 1` })
        .where(eq(showsTable.source_id, id));
    }
  }

  await db.insert(itunesTable).values(notSeenIds.map((id) => ({ id })));
  console.log(`Popularizer done. ${notSeenIds.length} podcasts not seen.`);
};
