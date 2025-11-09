import { capitalizeFirstLetter } from "@/lib/utils";
import { getLanguageCodeById, getLanguageIdByName, getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import Link from "next/link";
import { db } from "@/db";
import { listsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  const languageCode = getLanguageCodeById(languageId);

  const wordRows = await db
    .select()
    .from(listsTable)
    .where(eq(listsTable.language_code, languageCode!))
    .orderBy(listsTable.frequency)
    .limit(1000)
    .offset((page - 1) * 1000);

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
                className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-colorprimary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
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
