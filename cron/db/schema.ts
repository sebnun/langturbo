import { LANGUAGES_LIST } from "../lib/languages.ts";
import { sql } from "drizzle-orm";
import { index, pgTable, text, integer, timestamp, uuid, smallint, pgEnum, boolean, real } from "drizzle-orm/pg-core";

const isoLanguageCodes = Object.keys(LANGUAGES_LIST);

export const languageCodeEnum = pgEnum("language_code", isoLanguageCodes as [string, ...string[]]);
export const showTypeEnum = pgEnum("show_type", ["podcast", "youtube", "other"]);

export const showsTable = pgTable(
  "shows",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    source_id: text().notNull().unique(), // Should be unique across sources
    created_at: timestamp().defaultNow().notNull(),
    title: text().notNull(),
    description: text(),
    author: text(),
    fts: text().generatedAlwaysAs(sql`(${sql.identifier("title")} || ' ' || ${sql.identifier("author")})`),
    explicit: boolean(),
    image_url: text().notNull(),
    show_url: text(),
    source_url: text(), // Feed url
    country: text(),
    category_ids: smallint().array().notNull(),
    popularity: integer().notNull().default(0),
    language_code: languageCodeEnum().notNull(),
    show_type: showTypeEnum().default("podcast").notNull(),
    health_checked_at: timestamp().defaultNow().notNull(),
  },
  (table) => [
    index("shows_source_id_idx").on(table.source_id),
    index("shows_category_ids_idx").on(table.category_ids),
    index("shows_language_code_idx").on(table.language_code),
    index("shows_popularity_idx").on(table.popularity),
    index("shows_show_type_idx").on(table.show_type),
    index("shows_health_checked_at_idx").on(table.health_checked_at),
  ]
);