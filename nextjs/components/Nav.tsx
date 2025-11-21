import LogoTextSpan, { LogoIcon } from "@/components/Logo";
import Link from "next/link";
import Image from "next/image";
import PatreonImage from "../public/images/patreon.svg";
import { Button } from "./ui/button";

export default async function Nav() {
  return (
    <nav className="max-w-6xl mx-auto flex justify-between items-center p-6 border-b border-muted-text-foreground">
      <Link href="/" className="flex items-center space-x-2 ">
        <LogoIcon />
        <span className="hidden sm:inline">
          <LogoTextSpan />
        </span>
      </Link>

      <Button size="lg" asChild>
        <Link target="_blank" href="https://www.patreon.com/cw/sebnun">
          <Image src={PatreonImage} height={14} width={14} alt="Patreon" /> Support me on Patreon
        </Link>
      </Button>
    </nav>
  );
}
