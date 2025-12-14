import { notFound } from "next/navigation";
import { affiliateLinks, capitalizeFirstLetter, getOrdinal } from "@/lib/utils";
import Link from "next/link";
import { db } from "@/db";
import { episodesTable, listsTable, segmentsTable, sentencesTable, showsTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getLanguageCodeByName } from "@/lib/languages-legacy";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ query: string; language: string }> }) {
  const { query, language } = await params;

  return {
    title: `${decodeURIComponent(query)} ${capitalizeFirstLetter(language)} Pronunciation Examples`,
  };
}

export default async function Lookup({ params }: { params: Promise<{ query: string; language: string }> }) {
  const { query, language } = await params;
  const languageCode = getLanguageCodeByName(language);
  const decodedQuery = decodeURIComponent(query);

  // Use &@ oprator to search for single exact? queries
  const segmentRows = await db
    .select({
      text: segmentsTable.text,
      start: segmentsTable.start,
      id: segmentsTable.episode_id,
      title: episodesTable.title,
      show_id: episodesTable.show_id,
      show_title: showsTable.title,
      show_image_url: showsTable.image_url,
    })
    .from(segmentsTable)
    .innerJoin(episodesTable, eq(episodesTable.id, segmentsTable.episode_id))
    .innerJoin(showsTable, eq(showsTable.id, episodesTable.show_id))
    .where(and(sql`text &@ ${decodedQuery}`, eq(segmentsTable.language_code, languageCode)))
    .limit(10);

  if (!query) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="font-cormorant-garamond scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">
        {decodedQuery}
      </h1>
      <article className="prose prose-invert md:prose-lg max-w-none my-12">
        <p>Pronunciations of {decodedQuery}</p>
        <hr />
        {segmentRows.map((r, i) => (
          <Link
            key={`${r.id + i}`}
            href={`https://app.langturbo.com/${languageCode}/player?id=${encodeURIComponent(Buffer.from(r.id).toString("base64"))}&podcastId=${encodeURIComponent(r.show_id)}&title=${encodeURIComponent(r.title)}&podcastTitle=${encodeURIComponent(r.show_title)}&podcastImageUrl=${encodeURIComponent(r.show_image_url)}&playbackStart=${r.start}`}
          >
            <div className="flex items-center relative">
              <Image src={r.show_image_url} height={100} width={100} alt={r.show_title} objectFit="cover" />

              <h3 style={{ margin: "2rem" }}>{r.text}</h3>
            </div>
            <hr />
          </Link>
        ))}
        <div className="flex justify-center">
          <Link
            href={affiliateLinks[`${language}`]}
            rel="sponsored"
            className="no-underline relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
          >
            {capitalizeFirstLetter(language)} Language Learning Resources at Amazon
          </Link>
        </div>
      </article>
    </main>
  );
}
