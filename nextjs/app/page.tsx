import Footer from "@/components/Footer";
import { getLanguageCodeByName, getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import RetroGrid from "@/components/RetroGrid";
import { LanguagesMarquee } from "@/components/LanguagesMarquee";
import LogoTextSpan, { LogoIcon } from "@/components/Logo";
import ChevronImage from "../public/images/chevronblue.svg";
import Link from "next/link";
import Image from "next/image";
import PatreonImage from "../public/images/patreon.svg";
import { Button } from "@/components/ui/button";

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
          <div className="max-w-6xl m-auto flex items-center justify-between absolute top-0 left-0 right-0 p-6">
            <div className="flex items-center space-x-2">
              <LogoIcon />
              <LogoTextSpan />
            </div>

            <Button size="lg" className="font-bold text-md" asChild>
              <Link target="_blank" href="https://www.patreon.com/cw/sebnun">
                <Image src={PatreonImage} height={14} width={14} alt="Patreon" /> Support me on Patreon
              </Link>
            </Button>
          </div>

          <div>
            <h1 className="scroll-m-20 text-5xl font-extrabold md:leading-normal lg:text-6xl my-6">
              Learn languages{" "}
              <a
                href="#start"
                className="italic underline decoration-primary decoration-4 underline-offset-6 lg:decoration-8 lg:underline-offset-12 "
              >
                faster
              </a>{" "}
            </h1>
            <h2 className="scroll-m-20 text-3xl md:leading-normal lg:text-4xl my-6">
              with podcasts and the latest research, 100% free.
            </h2>
          </div>
        </div>
        <LanguagesMarquee />
      </section>
      <main className="border-y bg-linear-to-b from-[#111111] to-[#080000]" id="start">
        <div className="max-w-6xl mx-auto p-6">
          <h3 className="scroll-m-20 text-4xl font-extrabold md:leading-normal lg:text-5xl my-6 text-center">
            What language do you want to learn?
          </h3>
          <article className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(Object.values(languageIds)))
                .map((id) => getLanguageNameById(id))
                .sort()
                .map((language) => (
                  <Button size="lg" className="font-bold text-md" asChild key={language}>
                    <Link
                      prefetch={false}
                      key={language}
                      href={`https://app.langturbo.com/?language=${getLanguageCodeByName(language)}`}
                    >
                      {`${language.charAt(0).toUpperCase() + language.slice(1)}`}
                    </Link>
                  </Button>
                ))}
            </div>
          </article>
        </div>
      </main>
      <Footer isHome />
    </>
  );
}
