import { db } from "../db/index.ts";
import { showsTable } from "../db/schema.ts";
import { podcastXmlParser } from "podcast-xml-parser";
import { eq, sql } from "drizzle-orm";

export const runDoctorCron = async () => {
  console.log("Running doctor cron job");
  return
  const shows = await db.select().from(showsTable).orderBy(showsTable.health_checked_at).limit(1000);

  let deletedCount = 0;

  for (const show of shows) {
    try {
      const parsedPodcast = await podcastXmlParser(new URL(show.source_url), {
        requestHeaders: {
          "User-Agent": process.env.USER_AGENT,
        },
      });

      if (parsedPodcast.episodes.length === 0) {
        //throw new Error("No episodes");
        // It is possible that they add episodes later?, so don't delete
        console.log("No episodes found for", show.id);
      }
    } catch (e) {
      console.log("Failed to parse feed, deleting", show.id, e);

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
