import type { Metadata, Viewport } from "next";
import "overlayscrollbars/overlayscrollbars.css";
import "./globals.css";
import { baseUrl } from "./sitemap";
import ScrollableBody from "@/components/shell/ScrollableBody";
import { Cormorant_Garamond, Handjet } from 'next/font/google'
 
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant-garamond',
})

const handjet = Handjet({
  weight: 'variable',
  subsets: ["latin"],
  variable: "--font-handjet",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
    title: {
    template: '%s | LangTurbo',
    default: 'LangTurbo | Learn Languages Faster'
  },
  description: "LangTurbo takes you from intermediate to fluent in record time using podcasts",

  openGraph: {
    title: "LangTurbo | Learn Languages Faster",
    description: "LangTurbo takes you from intermediate to fluent in record time using podcasts",
    url: baseUrl,
    siteName: "LangTurbo",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${cormorantGaramond.variable} ${handjet.variable}`} data-overlayscrollbars-initialize>
      <ScrollableBody>{children}</ScrollableBody>
    </html>
  );
}
