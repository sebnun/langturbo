"use client";

import Image from "next/image";
import ChevronImage from "../public/images/chevron.svg";
import Link from "next/link";
// import { ANDROID_LINK, IOS_LINK } from "@/lib/constants";
import { getLanguageIdByName } from "@/lib/languages-legacy";

export default function LanguageLink({ language, isFooter }: { language: string; isFooter?: boolean }) {
  const handleLanguageClick = (language: string) => {
    const languageId = getLanguageIdByName(language);

    const ua = navigator.userAgent;
    // if (/android/i.test(ua)) {
    //   fetch("/api/install", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ language_id: languageId }),
    //   }).finally(() => (location.href = ANDROID_LINK));
    // } else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    //   fetch("/api/install", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ language_id: languageId }),
    //   }).finally(() => (location.href = IOS_LINK));
    // } else {
      location.href = `https://app.langturbo.com/?lang=${language}`;
    //}
  };

  return (
    <Link
      onClick={() => handleLanguageClick(language)}
      prefetch={false}
      className={
        isFooter
          ? "py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
          : "bg-colorprimary font-bold rounded-full hover:opacity-90 p-3 px-6 flex justify-between items-center"
      }
      href="/#"
    >
      {`${language.charAt(0).toUpperCase() + language.slice(1)}`}
      {!isFooter && <Image src={ChevronImage} height={8} width={8} alt="Next" className="inline" />}
    </Link>
  );
}
