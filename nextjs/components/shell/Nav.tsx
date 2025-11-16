import LogoTextSpan, { LogoIcon } from "@/components/site/Logo";
import Link from "next/link";
import Image from "next/image";
import PatreonImage from "../../public/images/patreon.svg";
import { Button } from "../ui/button";

export default async function Nav({ lang }: { lang: string }) {
  return (
    <nav className="flex justify-between items-center p-6">
      <Link href={`/${lang}`} className="flex items-center space-x-2 ">
        <LogoIcon />
      </Link>

      <Button size="lg" asChild>
        <Link prefetch={false} href="/">
          <Image src={PatreonImage} height={14} width={14} alt="Patreon" /> Support me on Patreon
        </Link>
      </Button>
    </nav>
  );
}
