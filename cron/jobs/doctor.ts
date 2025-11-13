import { db } from "../db/index.ts";
import { showsTable } from "../db/schema.ts";
import { podcastXmlParser, type Podcast } from "podcast-xml-parser";
import { eq, sql, inArray } from "drizzle-orm";
import { stripHtml } from "../lib/utils.ts";

// Goal is to keep info up to date and remove unreachable (by feed) podcasts

export const runDoctorCron = async () => {
  console.log("Running doctor cron job");
  const shows = await db.select().from(showsTable).orderBy(showsTable.health_checked_at).limit(500);

  const toDeleteIds = [];

  for (const show of shows) {
    if (show.source_url.startsWith("https://www.langturbo.com")) {
      continue;
    }

    // Do not rely on itunes here, original source is not just itunes

    let podcast: Podcast;
    try {
      const parsedPodcast = await podcastXmlParser(new URL(show.source_url), {
        requestHeaders: {
          "User-Agent": process.env.USER_AGENT,
        },
        //requestSize: 50000, // This can cause exception that make the feed invalid
      });

      podcast = parsedPodcast.podcast;
    } catch (e) {
      console.info("Failed to parse feed", show.source_url);
      toDeleteIds.push(show.id);

      continue;
    }

    // RSS feed might have different data than itunes processor, but should be similar enough
    await db
      .update(showsTable)
      .set({
        title: podcast.title ? podcast.title : show.title,
        description: podcast.description ? stripHtml(podcast.description) : show.description,
        // This is new
        show_url: podcast.link,
        author: podcast.itunesAuthor ? podcast.itunesAuthor : show.author,
        health_checked_at: sql`NOW()`,
      })
      .where(eq(showsTable.id, show.id));
  }

  await db.delete(showsTable).where(inArray(showsTable.id, toDeleteIds));

  console.log(`Doctor cron job completed. Deleted ${toDeleteIds.length} shows.`);
};
