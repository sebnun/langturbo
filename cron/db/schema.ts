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

export const episodesTable = pgTable(
  "episodes",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    created_at: timestamp().defaultNow().notNull(),
    title: text().notNull(),
    file_name: text().notNull(), // same as id but need the extension
    language_code: languageCodeEnum().notNull(),
    processed_seconds: real().default(-1),
    show_id: uuid()
      .references(() => showsTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [index("episodes_language_code_idx").on(table.language_code)]
);

export const captionsTable = pgTable(
  "captions",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    created_at: timestamp().defaultNow().notNull(),
    caption: text().notNull(),
    start: real().notNull(),
    words: text()
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    language_code: languageCodeEnum().notNull(),
    episode_id: uuid()
      .references(() => episodesTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [index("captions_language_code_idx").on(table.language_code)]
);

export const translationsTable = pgTable(
  "translations",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    created_at: timestamp().defaultNow().notNull(),
    translation: text().notNull(),
    language_code: languageCodeEnum().notNull(),
    caption_id: uuid()
      .references(() => captionsTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [index("translations_language_code_idx").on(table.language_code)]
);
