import { db } from "@/db";
import { episodesTable, showsTable } from "@/db/schema";
import { getLanguageCodeByName, getLanguageNameById } from "@/lib/languages-legacy";
import { asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const languageId = url.searchParams.get("languageId");

  const showRows = await db.select().from(showsTable).where(eq(showsTable.source_id, languageId!)).limit(1);
  // Theres more rows, but too long to wait to load all 10k
  const episodeRows = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.show_id, showRows[0].id))
    .orderBy(asc(episodesTable.created_at))
    .limit(1000);

  // mp3s have CBR 128 kbps
  // To get bytes, 16000 * duration in seconds
  const itemsXml = episodeRows
    .map(
      (episode) =>
        `<item>
<title>
<![CDATA[ ${episode.title} ]]>
</title>
<enclosure url="${episode.id}" length="${Math.floor(16000 * episode.processed_seconds!)}" type="audio/mpeg"/>
<description>
<![CDATA[ ${showRows[0].description!.replace(
          "LangTurbo.com",
          '<a href="http://www.langturbo.com">LangTurbo.com</a>'
        )} ]]>
</description>
<guid isPermaLink="false">${episode.id}</guid>
<itunes:duration>${episode.processed_seconds}</itunes:duration>
</item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"  xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>${showRows[0].title}</title>
<link>https://www.langturbo.com</link>
<copyright>LangTurbo</copyright>
<language>${getLanguageCodeByName(getLanguageNameById(+languageId!))}</language>
<itunes:keywords>learn,pronunciation,${getLanguageNameById(+languageId!)}</itunes:keywords>
<itunes:author>LangTurbo</itunes:author>
<itunes:subtitle>${showRows[0].description}</itunes:subtitle>
<itunes:summary><![CDATA[${showRows[0].description!.replace(
    "LangTurbo.com",
    '<a href="http://www.langturbo.com">LangTurbo.com</a>'
  )}]]></itunes:summary>
<description><![CDATA[${showRows[0].description!.replace(
    "LangTurbo.com",
    '<a href="http://www.langturbo.com">LangTurbo.com</a>'
  )}]]></description>
<itunes:explicit>false</itunes:explicit>
<itunes:image href="${showRows[0].image_url}"/>
<image>
  <url>${showRows[0].image_url}</url>
  <link>https://www.langturbo.com</link>
  <title>${showRows[0].title}</title>
</image>
<itunes:category text="Education">
  <itunes:category text="Language Learning" />
</itunes:category>
${itemsXml}
</channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
