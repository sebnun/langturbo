import EpisodeItem from "@/components/shell/EpisodeItem";
import { db } from "@/db";
import { episodesTable, showsTable } from "@/db/schema";
import { CATEGORIES, LANGUAGE_CATEGORIES } from "@/lib/categories";
import { getLanguageIdByName, languageIds } from "@/lib/languages-legacy";
import { eq } from "drizzle-orm";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Discover Podcasts - LangTurbo",
};

export default async function AppHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  // trending episodes

  const episodeShowRows = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.language_code, lang))
    .orderBy(episodesTable.last_played_at)
    .limit(10)
    .leftJoin(showsTable, eq(showsTable.id, episodesTable.show_id));
  // // top podcasts

  // const showsRows = await db
  //   .select()
  //   .from(showsTable)
  //   .where(eq(showsTable.language_code, lang))
  //   .orderBy(showsTable.popularity)
  //   .limit(10);

  // const thisLanguageCategories = LANGUAGE_CATEGORIES.find((lc) => lc.languageId === languageIds[lang])!.categories;
  // const topLevelCategories = CATEGORIES.filter((cat) => thisLanguageCategories.includes(cat.id))
  //     .map((category) => ({
  //       id: category.id,
  //       name: category.localizations.en,
  //     }))
  //     .sort((a, b) => a.name.localeCompare(b.name));

  // console.log(episodeRows, showsRows, topLevelCategories)

  // cat 1

  // cat 2

  return (
    <main className="bg-colorscreenbackground backdrop-blur-md">
      <div className="flex items-center justify-between p-6">
        <h1 className="text-xl md:text-2xl font-extrabold ">Now playing</h1>
        <div className="flex items-center space-x-3">
          <button className="bg-white p-2 hover:opacity-90  text-black">See all</button>
          <button className="bg-white p-2 hover:opacity-90 rounded-full">
            <ChevronLeft color="black" />
          </button>
          <button className="bg-white p-2 hover:opacity-90 rounded-full">
            <ChevronRight color="black" />
          </button>
        </div>
      </div>
      <section className="flex overflow-x-scroll scrollbar-hide space-x-2">
        {episodeShowRows.map((row) => (
          <EpisodeItem
            key={row.episodes.id}
            id={row.episodes.id}
            title={row.episodes.title}
            showId={row.shows!.id}
            showImageUrl={row.shows!.image_url}
            showTitle={row.shows!.title}
            showAuthor={row.shows?.author}
          />
        ))}
      </section>

      <h1 className="font-cormorant-garamond text-3xl md:text-4xl font-extrabold p-8">Now playing</h1>
      <section className="flex overflow-x-scroll scrollbar-hide space-x-2">
        {episodeShowRows.map((row) => (
          <EpisodeItem
            key={row.episodes.id}
            id={row.episodes.id}
            title={row.episodes.title}
            showId={row.shows!.id}
            showImageUrl={row.shows!.image_url}
            showTitle={row.shows!.title}
            showAuthor={row.shows?.author}
          />
        ))}
      </section>
    </main>
  );
}
