import { getBlogPosts } from "@/lib/blog";
import { getLanguageCodeById, getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import { MetadataRoute } from "next";
import { db } from "@/db";
import { listsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const baseUrl = "https://www.langturbo.com";

export const dynamic = "force-dynamic";

export async function generateSitemaps() {
  return [
    { id: 0 },
    ...Object.values(languageIds)
      .filter((id) => id !== 1)
      .map((id) => ({ id })),
  ];
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id)

  if (id === 0) {
    const posts = getBlogPosts().map((post) => ({
      url: `${baseUrl}/blog/${post.metadata.category.toLowerCase()}/${post.slug}`,
      //lastModified: post.metadata.publishedAt,
    }));
    return [
      { url: `${baseUrl}/` },
      { url: `${baseUrl}/blog` },
      { url: `${baseUrl}/pronunciation` },
      { url: `${baseUrl}/blog/langturbo` },
      ...posts,
    ];
  }

  const wordRows = await db
    .select()
    .from(listsTable)
    .where(eq(listsTable.language_code, getLanguageCodeById(id)!));

  return wordRows.map((row) => ({
    url: `${baseUrl}/pronunciation/${getLanguageNameById(id)}/${row.word}-${row.id}`,
  }));
}
