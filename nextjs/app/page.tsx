import Footer from "@/components/site/Footer";
import { getLanguageCodeByName, getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import RetroGrid from "@/components/site/RetroGrid";
import { LanguagesMarquee } from "@/components/site/LanguagesMarquee";
import LogoTextSpan, { LogoIcon } from "@/components/site/Logo";
import ChevronImage from "../public/images/chevron.svg";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "LangTurbo - Learn Languages with Podcasts",
};

export default function Home() {
  return (
    <>
      <section className="h-dvh flex flex-col justify-between relative bg-black">
        <RetroGrid angle={40} />
        <p>&nbsp;</p>
        <div className="text-center p-12">
          <div className="flex items-center justify-center space-x-2 absolute top-0 left-0 right-0 p-6">
            <LogoIcon />
            <LogoTextSpan />
          </div>
          <h1 className="scroll-m-20 text-4xl font-extrabold leading-normal lg:text-5xl my-6">
            Learn{" "}
            <a
              href="#start"
              className="italic underline decoration-colorprimary decoration-4 underline-offset-6 lg:decoration-8 lg:underline-offset-12 "
            >
              faster
            </a>{" "}
            with podcasts and the latest language learning research
          </h1>
        </div>
        <LanguagesMarquee />
      </section>
      <main className="bg-colorscreenbackground" id="start">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="scroll-m-20 text-4xl font-extrabold leading-normal lg:text-5xl my-6 text-center">
            What language do you want to learn?
          </h1>
          <article className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(Object.values(languageIds)))
                .map((id) => getLanguageNameById(id))
                .sort()
                .map((language) => (
                  <Link
                    key={language}
                    prefetch={false}
                    className={
                      "bg-colorprimary font-bold rounded-full hover:opacity-90 p-3 px-6 flex justify-between items-center"
                    }
                    href={`/${getLanguageCodeByName(language)}`}
                  >
                    {`${language.charAt(0).toUpperCase() + language.slice(1)}`}
                    <Image src={ChevronImage} height={8} width={8} alt="Next" className="inline" />
                  </Link>
                ))}
            </div>
          </article>
        </div>
      </main>
      <Footer isHome />
    </>
  );
}
