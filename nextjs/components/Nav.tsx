import LogoTextSpan, { LogoIcon } from "@/components/Logo";
import Link from "next/link";

export default async function Nav({ isHome }: { isHome?: boolean }) {
  return (
    <nav className="max-w-6xl mx-auto flex justify-between items-center p-6 border-b border-colorcardbackground">
      <Link href="/" className="flex items-center space-x-2 ">
        <LogoIcon />
        <span className="hidden sm:inline">
          <LogoTextSpan />
        </span>
      </Link>

      {!isHome && (
        <Link
          prefetch={false}
          href="/"
          className="bg-colorprimary font-bold rounded-full px-4 py-2 items-center hover:opacity-90"
        >
          Get Started for Free
        </Link>
      )}
    </nav>
  );
}
