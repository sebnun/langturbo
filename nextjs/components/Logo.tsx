import { Handjet } from "next/font/google";
import Image from "next/image";
import LogoImage from "../public/images/logo.svg";

import { cn } from "@/lib/utils";

const font = Handjet({
  weight: 'variable',
  subsets: ["latin"],
  //variable: "--font-sans",
});

export default function LogoTextSpan() {
  return (
    <span
      className={cn("text-white", font.className, 'text-4xl')}
    >
      LangTurbo
    </span>
  );
}

export function LogoIcon() {
  return <Image src={LogoImage} className="h-12 w-12" alt="LangTurbo Logo" />;
}
