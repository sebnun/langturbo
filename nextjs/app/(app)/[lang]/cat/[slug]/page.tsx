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

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug, lang } = await params;
  const name = decodeURIComponent(slug.split("-")[0]);

  return {
    title: `${name} ${getLanguageNameById(languageIds[lang])} podcasts`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = await params;
  const name = decodeURIComponent(slug.split("-")[0]);
  const id = decodeURIComponent(slug.split("-")[1]);

  return (
    <main className="pb-6">
      <h1 className="p-6 pb-3 text-xl md:text-2xl font-extrabold ">{name}</h1>
      <section className="px-3 flex overflow-x-scroll scrollbar-hide space-x-3">
        <Suspense
          fallback={Array(3)
            .fill(0)
            .map((_, i) => (
              <EpisodeItemSkeleton key={i} />
            ))}
        >
          <EpisodesLoader lang={lang} />
        </Suspense>
      </section>
    </main>
  );
}
