import { capitalizeFirstLetter } from "@/lib/utils";
import { getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import LookupButton from "@/components/LookupButton";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
  return [...new Set(Object.values(languageIds))]
    .filter((id) => id !== 1)
    .map((id) => getLanguageNameById(id))
    .map((language) => ({ language }));
}

export async function generateMetadata({ params }: { params: Promise<{ language: string }> }) {
  const language = (await params).language;

  return {
    title: `${capitalizeFirstLetter(language)} Pronunciation Lookup`,
  };
}

export default async function PronunciationLookupForm({
  params,
  searchParams,
}: {
  params: Promise<{ language: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const language = (await params).language;

  async function lookup(formData: FormData) {
    "use server";

    const query = formData.get("query");
    const language = formData.get("language");

    redirect(`/sayit/${language}/${encodeURIComponent(query as string)}`);
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="font-cormorant-garamond scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">
        {`${capitalizeFirstLetter(language)} Pronunciation Lookup`}
      </h1>
      <article className="py-12 flex justify-center">
        <form action={lookup} className="flex flex-col space-y-3 w-full">
          <input
            placeholder={`Type in ${language}`}
            type="search"
            name="query"
            required
            className="w-full bg-white placeholder:text-slate-400 text-slate-700 border border-slate-200 px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          />
          <input name="language" value={language} type="hidden" />
          <LookupButton />
        </form>
      </article>
    </main>
  );
}
