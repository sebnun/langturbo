import { db } from "../db/index.ts";
import { showsTable } from "../db/schema.ts";
import { podcastXmlParser } from "podcast-xml-parser";
import { USER_AGENT } from "../lib/constants.ts";
import { eq, sql } from "drizzle-orm";
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: process.env.MEILI_URL,
  apiKey: process.env.MEILI_MASTER_KEY,
});

export const runDoctorCron = async () => {
  console.log("Running doctor cron job");
  const shows = await db.select().from(showsTable).orderBy(showsTable.health_checked_at).limit(1000);

  let deletedCount = 0;

  for (const show of shows) {
    try {
      const parsedPodcast = await podcastXmlParser(new URL(show.source_url), {
        requestHeaders: {
          "User-Agent": USER_AGENT,
        },
      });

      if (parsedPodcast.episodes.length === 0) {
        //throw new Error("No episodes");
        // It is possible that they add episodes later?, so don't delete
        console.log("No episodes found for", show.id);
      }
    } catch (e) {
      console.log("Failed to parse feed, deleting", show.id, e);

      client.index(`captions_${show.language_code}`).deleteDocuments({
        filter: `show_id = ${show.id}`,
      });
      client.index(`shows_${show.language_code}`).deleteDocument(show.id);

      // Should cascade on db
      await db.delete(showsTable).where(eq(showsTable.id, show.id));
      continue;
    }

    await db
      .update(showsTable)
      .set({ health_checked_at: sql`NOW()` })
      .where(eq(showsTable.id, show.id));

    deletedCount++;
  }

  console.log(`Doctor cron job completed. Deleted ${deletedCount} shows.`);
};
