import { db } from "@/db";
import { verification } from "@/db/auth-schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (email?.toLowerCase() !== process.env.APP_REVIEWER_EMAIL) {
    return new Response("");
  }

  const rows = await db
    .select()
    .from(verification)
    .where(eq(verification.identifier, "sign-in-otp-" + process.env.APP_REVIEWER_EMAIL))
    .orderBy(desc(verification.createdAt))
    .limit(1);

  console.log('otp')

  return new Response(rows.length ? rows[0].value.replace(":0", "") : "");
}
