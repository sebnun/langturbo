import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { getDatabaseUri } from "@/lib/utils";

const db = drizzle({
  connection: getDatabaseUri(),
  casing: "snake_case",
  logger: process.env.NODE_ENV === "development",
});

export { db };
