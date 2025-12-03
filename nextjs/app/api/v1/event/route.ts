import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { type, languageCode } = await request.json();

  await db.insert(eventsTable).values({ type, user_id: session.user.id, language_code: languageCode });

  return new Response("ok");
}
