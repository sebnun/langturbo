import { db } from "@/db";
import { wordsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const word = searchParams.get("word");
  const languageCode = searchParams.get("languageCode");

  await db
    .delete(wordsTable)
    .where(
      and(
        eq(wordsTable.word, word!),
        eq(wordsTable.user_id, session.user.id),
        eq(wordsTable.language_code, languageCode!)
      )
    );

  return new Response("ok");
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { word, languageCode } = await request.json();

  await db.insert(wordsTable).values({ word, language_code: languageCode, user_id: session.user.id });

  return new Response("ok");
}
