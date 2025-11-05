import { db } from "@/db";
import { showsTable } from "@/db/schema";

// Kamal

export async function GET() {
  await db.select().from(showsTable).limit(1);
  console.log('is up')
  return new Response("ok");
}
