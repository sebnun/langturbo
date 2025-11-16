import { getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import { Suspense } from "react";
import ShowsLoader from "@/components/shell/ShowsLoader";
import ShowItemSkeleton from "@/components/shell/ShowItemSkeleton";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug, lang } = await params;
  const name = decodeURIComponent(slug.split("-")[0]);

  return {
    title: `${name} ${getLanguageNameById(languageIds[lang])} podcasts`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const name = decodeURIComponent(slug.split("-")[0]);
  const id = decodeURIComponent(slug.split("-")[1]);

  return (
    <main className="pb-6">
      <h1 className="p-6 pb-3 text-xl md:text-2xl font-extrabold text-center sm:text-left">{name}</h1>
      <section className="px-3 flex flex-wrap space-x-3 space-y-3 justify-center sm:justify-between">
        <Suspense
          fallback={Array(100)
            .fill(0)
            .map((_, i) => (
              <ShowItemSkeleton key={i} />
            ))}
        >
          <ShowsLoader lang={lang} catId={+id} limit={100} />
        </Suspense>
      </section>
    </main>
  );
}
