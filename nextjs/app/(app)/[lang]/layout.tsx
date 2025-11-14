import { PropsWithChildren } from "react";
import LogoTextSpan, { LogoIcon } from "@/components/site/Logo";
import Link from "next/link";

export default async function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <nav className="flex justify-between items-center p-4">
        <Link href="/" className="flex items-center space-x-2 ">
          <LogoIcon />
          <span className="hidden sm:inline">
            <LogoTextSpan />
          </span>
        </Link>

        <Link
          prefetch={false}
          href="/"
          className="bg-colorprimary font-bold rounded-full px-4 py-2 items-center hover:opacity-90"
        >
          Support on Patreon
        </Link>
      </nav>
      {children}
    </>
  );
}
