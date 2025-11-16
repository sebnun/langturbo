import { CATEGORIES, LANGUAGE_CATEGORIES } from "@/lib/categories";
import { getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SliderButtons from "@/components/shell/SliderButtons";
import React, { Suspense } from "react";
import EpisodesLoader from "@/components/shell/EpisodesLoader";
import EpisodeItemSkeleton from "@/components/shell/EpisodeItemSkeleton";
import ShowsLoader from "@/components/shell/ShowsLoader";
import ShowItemSkeleton from "@/components/shell/ShowItemSkeleton";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return {
    title: `Discover ${getLanguageNameById(languageIds[lang])} podcasts`,
  };
}

export default async function AppHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const thisLanguageCategories = LANGUAGE_CATEGORIES.find((lc) => lc.languageId === languageIds[lang])!.categories;
  const topLevelCategories = CATEGORIES.filter((cat) => thisLanguageCategories.includes(cat.id))
    .map((category) => ({
      id: category.id,
      name: category.localizations.en,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="pb-6">
      <div className="flex items-center justify-between p-6 pb-3">
        <h1 className="text-xl md:text-2xl font-extrabold ">Now playing</h1>
        <div className="flex items-center space-x-3">
          <SliderButtons targetId="now" />
        </div>
      </div>
      <section id="now" className="px-3 flex overflow-x-scroll scrollbar-hide space-x-3">
        <Suspense
          fallback={Array(10)
            .fill(0)
            .map((_, i) => (
              <EpisodeItemSkeleton key={i} />
            ))}
        >
          <EpisodesLoader lang={lang} />
        </Suspense>
      </section>

      <div className="flex items-center justify-between p-6 pb-3">
        <h1 className="text-xl md:text-2xl font-extrabold ">Top podcasts</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild>
            <Link href={`/${lang}/cat/${encodeURIComponent(`Top Podcasts-0`)}`}>See all</Link>
          </Button>
          <SliderButtons targetId="top" />
        </div>
      </div>
      <section id="top" className="px-3 flex overflow-x-scroll scrollbar-hide space-x-3 ">
        <Suspense
          fallback={Array(20)
            .fill(0)
            .map((_, i) => (
              <ShowItemSkeleton key={i} />
            ))}
        >
          <ShowsLoader lang={lang} />
        </Suspense>
      </section>

      {topLevelCategories.map((tlc, i) => {
        return (
          <React.Fragment key={tlc.id}>
            <div className="flex items-center justify-between p-6 pb-3">
              <h1 className="text-xl md:text-2xl font-extrabold ">{tlc.name}</h1>
              <div className="flex items-center space-x-3">
                <Button variant="outline" asChild>
                  <Link href={`/${lang}/cat/${encodeURIComponent(`${tlc.name}-${tlc.id}`)}`}>See all</Link>
                </Button>
                <SliderButtons targetId={`cat${tlc.id}`} />
              </div>
            </div>
            <section id={`cat${tlc.id}`} className="px-3 flex overflow-x-scroll scrollbar-hide space-x-3 ">
              <Suspense
                fallback={Array(20)
                  .fill(0)
                  .map((_, i) => (
                    <ShowItemSkeleton key={i} />
                  ))}
              >
                <ShowsLoader lang={lang} catId={tlc.id} />
              </Suspense>
            </section>
          </React.Fragment>
        );
      })}
    </main>
  );
}
