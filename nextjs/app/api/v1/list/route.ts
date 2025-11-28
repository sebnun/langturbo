import { db } from "@/db";
import { listsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const languageCode = searchParams.get("languageCode");

  const wordRows = await db
    .select({ word: listsTable.word })
    .from(listsTable)
    .where(eq(listsTable.language_code, languageCode!))
    .orderBy(listsTable.frequency)
    .limit(1000);

  return Response.json({ words: wordRows.map((row) => row.word) });
}
