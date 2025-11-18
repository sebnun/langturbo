import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { getDatabaseUri } from "./lib/utils";

export default defineConfig({
  out: "./drizzle",
  schema: ["./db/schema.ts", "./db/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUri().replace("nextjs-postgres", "127.0.0.1"),
  },
});
