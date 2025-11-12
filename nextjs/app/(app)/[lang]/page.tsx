import EpisodeItem from "@/components/shell/EpisodeItem";
import { db } from "@/db";
import { episodesTable, showsTable } from "@/db/schema";
import { CATEGORIES, LANGUAGE_CATEGORIES } from "@/lib/categories";
import { getLanguageIdByName, languageIds } from "@/lib/languages-legacy";
import { eq } from "drizzle-orm";

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
    <main>
      <h1>Now playing</h1>
      <section className="flex overflow-x-auto scrollbar-hide border-amber-200 border-2">
        {episodeShowRows.map((row) => (
          <EpisodeItem
            key={row.episodes.id}
            id={row.episodes.id}
            title={row.episodes.title}
            showId={row.shows!.id}
            showImageUrl={row.shows!.image_url}
            showTitle={row.shows!.title}
          />
        ))}
      </section>
    </main>
  );
}
