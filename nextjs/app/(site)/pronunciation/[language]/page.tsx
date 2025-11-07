import { capitalizeFirstLetter } from "@/utils";
import sql from "@/utils/db";
import { getLanguageIdByName, getLanguageNameById, languageIds } from "@/utils/languages";
import Link from "next/link";

export async function generateStaticParams() {
  return [...new Set(Object.values(languageIds))]
    .filter((id) => id !== 1)
    .map((id) => getLanguageNameById(id))
    .map((language) => ({ language }));
}

export async function generateMetadata({ params }: { params: Promise<{ language: string }> }) {
  const language = (await params).language;

  return {
    title: `${capitalizeFirstLetter(language)} Frequency List - LangTurbo`,
  };
}

export default async function FrequencyLanguageList({
  params,
  searchParams,
}: {
  params: Promise<{ language: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const language = (await params).language;
  const page = Number((await searchParams).page) || 1;
  const languageId = getLanguageIdByName(language);

  const wordRows =
    await sql`select * from lists where language_id = ${languageId} and duration != -1 order by frequency limit 1000 offset ${
      (page - 1) * 1000
    }`;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">
        {`${capitalizeFirstLetter(language)} Frequency List`}
      </h1>
      <article className="py-12">
        {wordRows.map((row, i) => (
          <div key={i} className="flex flex-col mb-6">
            <div className="w-full flex flex-col md:flex-row space-x-0 space-y-2 md:space-x-2 md:space-y-0 items-center">
              <div className="space-x-2">
                <code className=" text-colortextsubdued tabular-nums text-sm text-center md:text-left">
                  # {(page - 1) * 1000 + i + 1}
                </code>
              </div>
              <Link
                href={`/pronunciation/${language}/${row.word}-${row.id}`}
                className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
              >
                {row.word}
              </Link>
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-12">
          {page > 1 && <Link href={`/pronunciation/${language}?page=${page - 1}`}>&lsaquo; Previous</Link>}
          {wordRows.length === 1000 && <Link href={`/pronunciation/${language}?page=${page + 1}`}>Next &rsaquo;</Link>}
        </div>
      </article>
    </main>
  );
}
