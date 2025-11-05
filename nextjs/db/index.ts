import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { getDatabaseUri } from "@/lib/utils";

const db = drizzle({ connection: getDatabaseUri(), casing: "snake_case" });

export { db };
