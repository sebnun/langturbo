import { languageIds } from "@/lib/languages-legacy";
import { baseUrl } from "../sitemap";

export async function GET() {
  const sitemapIndices = [0, ...Object.values(languageIds).filter((id) => id !== 1)];

  const itemsXml = sitemapIndices
    .map((index) => `<sitemap><loc>${baseUrl}/sitemap/${index}.xml</loc></sitemap>`)
    .join("\n");

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${itemsXml}
    </sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
