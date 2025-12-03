import { db } from "@/db";
import { playbackTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { episodeId, percentage, languageCode } = await request.json();
  await db
    .insert(playbackTable)
    .values({ episode_id: episodeId, user_id: session.user.id, percentage, language_code: languageCode });

  return new Response("ok");
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { episodeId, percentage } = await request.json();

  await db
    .update(playbackTable)
    .set({ percentage })
    .where(and(eq(playbackTable.episode_id, episodeId), eq(playbackTable.user_id, session.user.id)));

  return new Response("ok");
}
