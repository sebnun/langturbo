import { db } from "@/db";
import { savedTable } from "@/db/schema";
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
  const showId = searchParams.get("showId");

  await db.delete(savedTable).where(and(eq(savedTable.show_id, showId!), eq(savedTable.user_id, session.user.id)));

  return new Response("ok");
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { showId } = await request.json();

  await db.insert(savedTable).values({ show_id: showId, user_id: session.user.id });

  return new Response("ok");
}
