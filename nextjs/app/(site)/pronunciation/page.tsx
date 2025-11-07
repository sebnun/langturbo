import { capitalizeFirstLetter } from "@/utils";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import Link from "next/link";

export const metadata = {
  title: "Frequency Lists - LangTurbo",
};

export default async function FrequencyLists() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">Frequency Lists</h1>
      <article className="py-12">
        {[...new Set(Object.values(languageIds))]
          .filter((id) => id !== 1)
          .map((id) => getLanguageNameById(id))
          .map((language) => (
            <div key={language} className="flex flex-col mb-6">
              <div className="w-full flex flex-col md:flex-row space-x-0 space-y-2 md:space-x-2 md:space-y-0 items-center">
                <div className="space-x-2">
                  <code className=" text-colortextsubdued tabular-nums text-sm text-center md:text-left">
                    Frequency List
                  </code>
                </div>
                <Link
                  href={`/pronunciation/${language}`}
                  className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
                >
                  {capitalizeFirstLetter(language)}
                </Link>
              </div>
            </div>
          ))}
      </article>
    </main>
  );
}
