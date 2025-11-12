import type { Metadata, Viewport } from "next";
import "overlayscrollbars/overlayscrollbars.css";
import "./globals.css";

import { baseUrl } from "./sitemap";
import ScrollableBody from "@/components/shell/ScrollableBody";
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "LangTurbo - Learn Languages Faster",
  description: "LangTurbo takes you from intermediate to fluent in record time using podcasts",

  openGraph: {
    title: "LangTurbo - Learn Languages Faster",
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
    <html lang="en" className="scroll-smooth" data-overlayscrollbars-initialize>
      <ScrollableBody>{children}</ScrollableBody>
    </html>
  );
}
