import Link from "next/link";
import IosImage from "../public/images/ios.svg";
import AndroidImage from "../public/images/android.svg";
import XImage from "../public/images/x.svg";
import PatreonImage from "../public/images/patreon.svg";
import GithubImage from "../public/images/github.svg";
import RSSImage from "../public/images/rss.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Surprise from "./Surprise";
import { Button } from "./ui/button";
// import { ANDROID_LINK, IOS_LINK } from "@/utils/constants";

export default function Footer({ isHome }: { isHome?: boolean }) {
  return (
    <footer>
      <div
        className={cn(
          !isHome && "border-t border-muted-text-foreground",
          "max-w-6xl mx-auto p-6 py-12 flex flex-col-reverse text-center md:flex-row md:space-y-0 md:justify-between md:text-left"
        )}
      >
        <div className="mt-12 md:mt-0">
          <p className="font-bold mb-3">
            <code>ABOUT</code>
          </p>
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
          </div>
        </div>

        <div className="mt-12 md:mt-0">
          <p className="font-bold mb-3">
            <code>FREE TOOLS</code>
          </p>
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

        {/* <div>
          <p className="font-bold mb-3">GET THE APP</p>
          <div className="flex flex-col space-y-3">
            <Link href="">
              <Image src={IosImage} alt="Download iOS app" className="inline" />
            </Link>
            <Link href="">
              <Image src={AndroidImage} alt="Download Android app" className="inline" />
            </Link>
          </div>
        </div> */}
      </div>
      <div className="flex items-center m-6">
        <p className="text-right pr-3 flex-1 text-muted-foreground text-xl font-handjet hidden sm:inline-block">LangTurbo MMXXV</p>

        <div className="space-x-3 mr-auto ml-auto">
          <Button variant="outline" size="icon" className="rounded-full p-2">
            <Link target="_blank" href="https://www.patreon.com/cw/sebnun">
              <Image src={PatreonImage} alt="Patreon" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full p-2">
            <Link target="_blank" href="https://x.com/sebbenun">
              <Image src={XImage} alt="X" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full p-2">
            <Link target="_blank" href="https://github.com/sebnun/langturbo">
              <Image src={GithubImage} alt="Github" />
            </Link>
          </Button>
        </div>
        <p className="flex-1 pl-3 text-muted-foreground text-xl font-handjet hidden sm:inline-block">
          Made with &nbsp;&#10084;&nbsp; by{" "}
          <a className="underline" href="https://www.patreon.com/cw/sebnun" target="_blank">
            sebnun
          </a>
        </p>
      </div>
    </footer>
  );
}
