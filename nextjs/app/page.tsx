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

            <Button size="lg" asChild>
              <Link prefetch={false} href="/">
                <Image src={PatreonImage} height={14} width={14} alt="Patreon" /> Support me on Patreon
              </Link>
            </Button>
          </div>

          <div>
            <h1 className="font-cormorant-garamond scroll-m-20 text-5xl font-extrabold md:leading-normal lg:text-6xl my-6">
              Learn languages{" "}
              <a
                href="#start"
                className="italic underline decoration-primary decoration-4 underline-offset-6 lg:decoration-8 lg:underline-offset-12 "
              >
                faster
              </a>{" "}
            </h1>
            <h2 className="font-cormorant-garamond scroll-m-20 text-3xl md:leading-normal lg:text-4xl my-6">
              with podcasts and the latest research, 100% free.
            </h2>
          </div>
        </div>
        <LanguagesMarquee />
      </section>
      <main className="bg-primary" id="start">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="font-cormorant-garamond scroll-m-20 text-5xl font-extrabold md:leading-normal lg:text-6xl my-6 text-center">
            What language do you want to learn?
          </h1>
          <article className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(Object.values(languageIds)))
                .map((id) => getLanguageNameById(id))
                .sort()
                .map((language) => (
                  // <Button size="lg" variant='outline' className="bg-white" asChild key={language}>
                    <Link
                      prefetch={false}
                      key={language}
                      className={
                        "bg-white border font-bold hover:opacity-90 p-3 px-6 flex justify-between items-center text-primary"
                      }
                      href={`/${getLanguageCodeByName(language)}`}
                    >
                      {`${language.charAt(0).toUpperCase() + language.slice(1)}`}
                      <Image
                        src={ChevronImage}
                        height={8}
                        width={8}
                        alt={`Start learning ${language.charAt(0).toUpperCase() + language.slice(1)}`}
                      />
                    </Link>
                  // </Button>
                ))}
            </div>
          </article>
        </div>
      </main>
      <Footer isHome />
    </>
  );
}
