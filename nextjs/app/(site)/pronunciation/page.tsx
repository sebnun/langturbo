import { capitalizeFirstLetter } from "@/lib/utils";
import { getLanguageNameById, languageIds } from "@/lib/languages-legacy";
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
                  className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-colorprimary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
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
