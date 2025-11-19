import { type NextRequest } from "next/server";
import { convertDateToHuman, convertSecondsDurationToHuman, stripHtml } from "@/lib/utils";
import { backOff } from "exponential-backoff";
import { podcastXmlParser } from "podcast-xml-parser";
import { db } from "@/db";
import { showsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CATEGORIES } from "@/lib/categories";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const feedUrl = decodeURIComponent(searchParams.get("sourceUrl") as string);
  const showtId = searchParams.get("showId");

  let episodes: PodcastEpisode[] = [];

  try {
    const parsedPodcast = await backOff(
      () =>
        podcastXmlParser(new URL(feedUrl), {
          requestHeaders: {
            "User-Agent": process.env.USER_AGENT!,
          },
        }),
      {
        retry: (e, attempt) => {
          console.error("Failed to lookup", attempt, feedUrl);
          return true;
        },
        timeMultiple: 2,
        numOfAttempts: 3,
      }
    );

    episodes = parsedPodcast.episodes.map((item) => {
      //console.log("item", item);
      return {
        title: item.title,
        id: item.enclosure!.url,
        description: stripHtml(item.description),
        duration: convertSecondsDurationToHuman(item.itunesDuration),
        date: convertDateToHuman(item.pubDate) === "Invalid Date" ? "" : convertDateToHuman(item.pubDate),
      };
    });
  } catch (e) {
    console.error("Failed to parse podcast", feedUrl, e);
  }

  const showRows = await db.select().from(showsTable).where(eq(showsTable.id, showtId!)).limit(1);

  const categories = showRows[0].category_ids.map((id) => {
    let name = "";
    for (const cat of CATEGORIES) {
      // Search main category
      if (cat.id === id) {
        name = cat.localizations.en;
        break;
      }

      if (cat.subcategories) {
        for (const subcat of cat.subcategories) {
          if (subcat.id === id) {
            name = subcat.localizations.en;
            break;
          }
        }
      }
    }

    return { id, name };
  });

  return Response.json({ episodes, categories });
}
