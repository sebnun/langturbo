import { db } from "../db/index.ts";
import { showsTable } from "../db/schema.ts";
import { podcastXmlParser, type Episode, type Podcast } from "podcast-xml-parser";
import { eq, sql } from "drizzle-orm";
import { stripHtml } from "../lib/processor.ts";

// Goal is to keep info up to date and remove unreachable (by feed) podcasts

export const runDoctorCron = async () => {
  console.log("Running doctor cron job", new Date());
  const shows = await db.select().from(showsTable).orderBy(showsTable.health_checked_at).limit(1000);

  let deletedCount = 0;

  for (const show of shows) {
    // Do not rely on itunes here, I could add podcasts not from itunes in the future

    let podcast: Podcast;
    let episodes: Episode[];
    try {
      const parsedPodcast = await podcastXmlParser(new URL(show.source_url), {
        requestHeaders: {
          "User-Agent": process.env.USER_AGENT,
        },
      });

      podcast = parsedPodcast.podcast;
      episodes = parsedPodcast.episodes;
    } catch (e) {
      console.info("Failed to parse feed", show.source_url, e);

      await db.delete(showsTable).where(eq(showsTable.id, show.id));
      deletedCount++;

      continue;
    }

    // These are have different source than itunes processor, but should be similar enough
    await db
      .update(showsTable)
      .set({
        title: podcast.title,
        description: stripHtml(podcast.description),
        show_url: podcast.link,
        health_checked_at: sql`NOW()`,
      })
      .where(eq(showsTable.id, show.id));
  }

  console.log(`Doctor cron job completed. Deleted ${deletedCount} shows.`);
};
