import LogoTextSpan, { LogoIcon } from "@/components/site/Logo";
import Link from "next/link";
import Image from "next/image";
import PatreonImage from "../../public/images/patreon.svg";

export default async function Nav({ lang }: { lang: string }) {
  return (
    <nav className="flex justify-between items-center p-6">
      <Link href={`/${lang}`} className="flex items-center space-x-2 ">
        <LogoIcon />
      </Link>

      <Link prefetch={false} href="/" className="bg-primary font-bold px-4 py-2 items-center hover:opacity-90">
        <Image src={PatreonImage} height={14} width={14} alt="TikTok" className="mr-2 inline align-baseline" />
        Support me on Patreon
      </Link>
    </nav>
  );
}
