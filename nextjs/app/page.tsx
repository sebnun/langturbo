import Footer from "@/components/Footer";
import { getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import RetroGrid from "@/components/RetroGrid";
import { LanguagesMarquee } from "@/components/LanguagesMarquee";
import LogoTextSpan, { LogoIcon } from "@/components/Logo";
import LanguageLink from "@/components/LanguageLink";

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
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">
            Learn <span className="italic">faster</span> with podcasts and the latest language learning research.
          </h1>
        </div>
        <LanguagesMarquee />
      </section>

      <main className="bg-colorscreenbackground">
        <div className="max-w-6xl mx-auto p-6">
          {/* <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6 text-center md:text-left">
            LangTurbo is not accepting new users at the moment. Check back soon!
          </h1> */}
                    <h1 className="bg-colorprimary">
            LangTurbo is not accepting new users at the moment. Check back soon!
          </h1>
          <article className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(Object.values(languageIds)))
                .map((id) => getLanguageNameById(id))
                .sort()
                .map((language) => (
                  <LanguageLink key={language} language={language} />
                ))}
            </div>
          </article>
        </div>
      </main>
      <Footer isHome />
    </>
  );
}
