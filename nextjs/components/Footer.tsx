import Link from "next/link";
import IosImage from "../../public/images/ios.svg";
import AndroidImage from "../../public/images/android.svg";
import XImage from "../public/images/x.svg";
// import YoutubeImage from "../../public/images/youtube.svg";
// import TiktokImage from "../../public/images/tiktok.svg";
import RSSImage from "../public/images/rss.svg";
import Image from "next/image";
import { getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import { cn } from "@/lib/utils";
import Surprise from "./Surprise";
// import { ANDROID_LINK, IOS_LINK } from "@/utils/constants";
import LanguageLink from "./LanguageLink";

export default function Footer({ isHome }: { isHome?: boolean }) {
  return (
    <footer
      className={cn(
        !isHome && "border-t border-colorcardbackground",
        "max-w-6xl mx-auto p-6 py-12 flex flex-col-reverse text-center md:flex-row md:space-y-0 md:justify-between md:text-left bg-black"
      )}
    >
      <div className="mt-12 md:mt-0">
        <p className="font-bold mb-3">ABOUT</p>
        <div className="flex flex-col space-y-3 justify-center mx-auto text-center">
          <Surprise />
          <Link
            className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
            href="/blog"
          >
            Blog
          </Link>
          <Link
            className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
            href="/pronunciation"
          >
            Frequency Lists
          </Link>
          <Link
            className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
            href="/contact"
          >
            Contact
          </Link>
          <Link
            className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
            href="/privacy"
          >
            Privacy
          </Link>
          <Link
            className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
            href="/terms"
          >
            Terms
          </Link>
          <code className="text-colortextsubdued text-sm pt-3">MMXXV LangTurbo</code>
        </div>
      </div>

      {!isHome && (
        <div className="mt-12 md:mt-0">
          <p className="font-bold mb-3">LEARN WITH PODCASTS</p>
          <div className="flex flex-col space-y-3">
            {Array.from(new Set(Object.values(languageIds)))
              .map((id) => getLanguageNameById(id))
              .sort()
              .map((language) => {
                return <LanguageLink key={language} language={language} isFooter />;
              })}
          </div>
        </div>
      )}

      <div className="mt-12 md:mt-0">
        <p className="font-bold mb-3">SOCIAL</p>
        <div className="flex flex-col space-y-3">
          <Link
            className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
            href="https://x.com/LangTurbo"
          >
            <Image src={XImage} height={14} width={14} alt="X" className="mr-2 inline align-baseline" />X
          </Link>
          {/* <Link className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0" href="/contact">
            <Image src={YoutubeImage} height={14} width={14} alt="YouTube" className="mr-2 inline align-baseline" />
            YouTube
            
          </Link>
          <Link className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0" href="/contact">
            <Image src={TiktokImage} height={14} width={14} alt="TikTok" className="mr-2 inline align-baseline" />
            TikTok
          </Link> */}
          <Link
            className=" py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
            href="/rss"
          >
            <Image src={RSSImage} height={14} width={14} alt="RSS Link" className="mr-2 inline align-baseline" />
            RSS
          </Link>
        </div>
      </div>

      {/* <div>
        <p className="font-bold mb-3">GET THE APP</p>
        <div className="flex flex-col space-y-3">
          <Link href={IOS_LINK}>
            <Image src={IosImage} alt="Download iOS app" className="inline" />
          </Link>
          <Link href={ANDROID_LINK}>
            <Image src={AndroidImage} alt="Download Android app" className="inline" />
          </Link>
        </div>
      </div> */}
    </footer>
  );
}
