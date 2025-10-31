import { LANGUAGES_LIST } from "../lib/languages.ts";
import { pgTable, text, integer, timestamp, uuid, smallint, pgEnum, boolean } from "drizzle-orm/pg-core";

const isoLanguageCodes = Object.keys(LANGUAGES_LIST);

export const languageCodeEnum = pgEnum("language_code", isoLanguageCodes as [string, ...string[]]);
export const showTypeEnum = pgEnum("show_type", ["podcast", "youtube", "other"]);

export const showsTable = pgTable("shows", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  source_id: text().notNull().unique(), // Should be unique across sources
  created_at: timestamp().defaultNow().notNull(),
  title: text().notNull(),
  description: text(),
  author: text(),
  explicit: boolean(),
  image_url: text().notNull(),
  show_url: text(),
  source_url: text(), // Feed url
  country: text(),
  category_ids: smallint().array().notNull(),
  popularity: integer().notNull().default(0),
  language_code: languageCodeEnum().notNull(),
  show_type: showTypeEnum().default('podcast').notNull(),
  health_checked_at: timestamp().defaultNow().notNull(),
});
