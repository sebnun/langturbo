import Link from "next/link";
import IosImage from "../public/images/ios.svg";
import AndroidImage from "../public/images/android.svg";
import XImage from "../public/images/x.svg";
//import YoutubeImage from "../public/images/youtube.svg";
import PatreonImage from "../public/images/patreon.svg";
// import TiktokImage from "../public/images/tiktok.svg";
import RSSImage from "../public/images/rss.svg";
import Image from "next/image";
import { getLanguageCodeByName, getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import { cn } from "@/lib/utils";
import Surprise from "./Surprise";
// import { ANDROID_LINK, IOS_LINK } from "@/utils/constants";

export default function Footer({ isHome }: { isHome?: boolean }) {
  return (
    <footer
      className={cn(
        !isHome && "border-t border-white",
        "max-w-6xl mx-auto p-6 py-12 flex flex-col-reverse text-center md:flex-row md:space-y-0 md:justify-between md:text-left bg-black"
      )}
    >
      <div className="mt-12 md:mt-0">
        <p className="font-bold mb-3"><code>ABOUT</code></p>
        <div className="flex flex-col space-y-3 justify-center mx-auto text-center">
          <Link
            className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
            href="/blog"
          >
            Blog
          </Link>

          <Link
            className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
            href="/contact"
          >
            Contact
          </Link>
          <Link
            className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
            href="/privacy"
          >
            Privacy
          </Link>
          <Link
            className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
            href="/terms"
          >
            Terms
          </Link>
          <code className="text-muted-foreground text-sm pt-3">MMXXV LangTurbo</code>
        </div>
      </div>

      {/* {!isHome && (
        <div className="mt-12 md:mt-0">
          <p className="font-bold mb-3">LEARN WITH PODCASTS</p>
          <div className="flex flex-col space-y-3">
            {Array.from(new Set(Object.values(languageIds)))
              .map((id) => getLanguageNameById(id))
              .sort()
              .map((language) => {
                return (
                  <Link
                    key={language}
                    prefetch={false}
                    className={`relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300`}
                    href={`/${getLanguageCodeByName(language)}`} // TODO
                  >
                    {`${language.charAt(0).toUpperCase() + language.slice(1)}`}
                  </Link>
                );
              })}
          </div>
        </div>
      )} */}

      <div className="mt-12 md:mt-0">
        <p className="font-bold mb-3"><code>FREE TOOLS</code></p>
        <div className="flex flex-col space-y-3 justify-center mx-auto text-center">
          <Link
            className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
            href="/pronunciation"
          >
            Frequency Lists
          </Link>
          <Surprise />
        </div>
      </div>

      <div className="mt-12 md:mt-0">
        <p className="font-bold mb-3"><code>SOCIAL</code></p>
        <div className="flex flex-col space-y-3">
          <Link
            className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
            href="/contact"
          >
            <Image src={PatreonImage} height={14} width={14} alt="TikTok" className="mr-2 inline align-baseline" />
            Patreon
          </Link>
          <Link
            className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
            href="https://x.com/LangTurbo"
          >
            <Image src={XImage} height={14} width={14} alt="X" className="mr-2 inline align-baseline" />X
          </Link>
          {/* <Link className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300" href="/contact">
            <Image src={YoutubeImage} height={14} width={14} alt="YouTube" className="mr-2 inline align-baseline" />
            YouTube
            
          </Link> */}
          {/*<Link className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300" href="/contact">
            <Image src={TiktokImage} height={14} width={14} alt="TikTok" className="mr-2 inline align-baseline" />
            TikTok
          </Link> */}
          <Link
            className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
            href="/rss"
          >
            <Image src={RSSImage} height={14} width={14} alt="RSS Link" className="mr-2 inline align-baseline" />
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
