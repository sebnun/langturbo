import LogoTextSpan, { LogoIcon } from "@/components/site/Logo";
import Link from "next/link";
import Image from "next/image";
import PatreonImage from "../../public/images/patreon.svg";

export default async function Nav() {
  return (
    <nav className="max-w-6xl mx-auto flex justify-between items-center p-6 border-b border-white">
      <Link href="/" className="flex items-center space-x-2 ">
        <LogoIcon />
        <span className="hidden sm:inline">
          <LogoTextSpan />
        </span>
      </Link>

      <Link prefetch={false} href="/" className="bg-colorprimary font-bold px-4 py-2 items-center hover:opacity-90">
        <Image src={PatreonImage} height={14} width={14} alt="TikTok" className="mr-2 inline align-baseline" />
        Support on Patreon
      </Link>
    </nav>
  );
}
