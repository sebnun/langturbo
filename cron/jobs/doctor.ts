import { db } from "../db/index.ts";
import { showsTable } from "../db/schema.ts";
import { podcastXmlParser, type Episode, type Podcast } from "podcast-xml-parser";
import { eq, sql, inArray } from "drizzle-orm";
import { stripHtml } from "../lib/utils.ts";

// Goal is to keep info up to date and remove unreachable (by feed) podcasts

export const runDoctorCron = async () => {
  console.log("Running doctor cron job", new Date());
  const shows = await db.select().from(showsTable).orderBy(showsTable.health_checked_at).limit(2000);

  const toDeleteIds = [];
  const toUpdatePromises = [];

  for (const show of shows) {
    if (show.source_url.startsWith("https://www.langturbo.com")) {
      continue;
    }

    // Do not rely on itunes here, I could add podcasts not from itunes in the future

    let podcast: Podcast;
    try {
      const parsedPodcast = await podcastXmlParser(new URL(show.source_url), {
        requestHeaders: {
          "User-Agent": process.env.USER_AGENT,
        },
      });

      podcast = parsedPodcast.podcast;
    } catch (e) {
      console.info("Failed to parse feed", show.source_url);
      toDeleteIds.push(show.id);

      continue;
    }

    // These are different sources than itunes processor, but should be similar enough
    toUpdatePromises.push(
      db
        .update(showsTable)
        .set({
          title: podcast.title ? podcast.title : show.title,
          description: podcast.description ? stripHtml(podcast.description) : show.description,
          // This is new
          show_url: podcast.link,
          author: podcast.itunesAuthor ? podcast.itunesAuthor : show.author,
          health_checked_at: sql`NOW()`,
        })
        .where(eq(showsTable.id, show.id))
    );
  }

  await Promise.all([db.delete(showsTable).where(inArray(showsTable.id, toDeleteIds)), ...toUpdatePromises]);

  console.log(`Doctor cron job completed. Deleted ${toDeleteIds.length} shows.`);
};
