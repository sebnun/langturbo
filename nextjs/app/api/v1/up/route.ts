import { db } from "@/db";
import { showsTable } from "@/db/schema";

// Kamal

export async function GET() {
  // TODO
  //await db.select().from(showsTable).limit(1);
  return new Response("ok");
}
