import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const URI = `postgresql://postgres:${process.env.POSTGRES_PASSWORD!}@nextjs-postgres:5432/langturbo`

const db = drizzle({ connection: `process.env.DATABASE_URL!`, casing: "snake_case" });

export { db };
