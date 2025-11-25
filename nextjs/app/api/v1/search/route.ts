import { db } from "@/db";
import { showsTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const languageCode = searchParams.get("languageCode");
  const query = searchParams.get("query");

  // Use &@~ oprator to search for multiple words
  const podcastsRows = await db
    .select()
    .from(showsTable)
    .where(and(sql`fts &@~ ${query}`, eq(showsTable.language_code, languageCode!)))
    .limit(50);

  return Response.json({
    results: podcastsRows.map((row) => ({
      id: row.id,
      title: row.title,
      imageUrl: row.image_url,
      feedUrl: row.source_url,
      description: row.description,
      author: row.author,
      country: row.country,
    })),
  });
}
