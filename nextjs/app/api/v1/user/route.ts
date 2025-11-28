import { db } from "@/db";
import { playbackTable, savedTable, showsTable, wordsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const languageCode = searchParams.get("languageCode");

  const playbackQuery = db
    .select({
      percentage: playbackTable.percentage,
      episode_id: playbackTable.episode_id,
    })
    .from(playbackTable)
    .where(and(eq(playbackTable.user_id, session.user.id), eq(playbackTable.language_code, languageCode!)));

  const savedQuery = db
    .select({
      id: showsTable.id,
      title: showsTable.title,
      description: showsTable.description,
      author: showsTable.author,
      image_url: showsTable.image_url,
      source_url: showsTable.source_url,
      country: showsTable.country,
    })
    .from(showsTable)
    .where(
      and(
        inArray(
          showsTable.id,
          db.select({ show_id: savedTable.show_id }).from(savedTable).where(eq(savedTable.user_id, session.user.id))
        ),
        eq(showsTable.language_code, languageCode!)
      )
    );

  const wordsQuery = db
    .select({ word: wordsTable.word })
    .from(wordsTable)
    .where(and(eq(wordsTable.user_id, session.user.id), eq(wordsTable.language_code, languageCode!)));

  const [playbackRows, savedRows, wordsRows] = await Promise.all([playbackQuery, savedQuery, wordsQuery]);

  return Response.json({
    playback: playbackRows.map((row) => ({
      percentage: row.percentage,
      episodeId: row.episode_id,
    })),
    saved: savedRows.map((row) => ({
      id: row.id,
      title: row.title,
      imageUrl: row.image_url,
      author: row.author,
      feedUrl: row.source_url,
      description: row.description,
      country: row.country,
    })),
    words: wordsRows.map((row) => row.word),
  });
}
