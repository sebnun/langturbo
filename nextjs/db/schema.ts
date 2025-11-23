import { LANGUAGES_LIST } from "@/lib/languages";
import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  smallint,
  pgEnum,
  boolean,
  real,
  numeric,
  jsonb,
  doublePrecision,
} from "drizzle-orm/pg-core";

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

export const episodesTable = pgTable(
  "episodes",
  {
    id: text().primaryKey(),
    created_at: timestamp().defaultNow().notNull(),
    last_played_at: timestamp().defaultNow().notNull(),
    title: text().notNull(),
    file_name: text().notNull(),
    language_code: languageCodeEnum().notNull(),
    processed_seconds: doublePrecision().default(-1),
    show_id: uuid()
      .references(() => showsTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    index("episodes_language_code_idx").on(table.language_code),
    index("episodes_last_played_at_idx").on(table.last_played_at),
    index("episodes_show_id_idx").on(table.show_id),
  ]
);

export const segmentsTable = pgTable(
  "segments",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    created_at: timestamp().defaultNow().notNull(),
    text: text().notNull(),
    start: doublePrecision().notNull(),
    end: doublePrecision().notNull(),
    words: jsonb(),
    language_code: languageCodeEnum().notNull(),
    episode_id: text()
      .references(() => episodesTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    index("segments_language_code_idx").on(table.language_code),
    index("segments_episode_id_idx").on(table.episode_id),
  ]
);

export const translationsTable = pgTable(
  "translations",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    created_at: timestamp().defaultNow().notNull(),
    translation: text().notNull(),
    language_code: languageCodeEnum().notNull(),
    segment_id: uuid()
      .references(() => segmentsTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    index("translations_language_code_idx").on(table.language_code),
    index("translations_segment_id_idx").on(table.segment_id),
  ]
);

export const listsTable = pgTable(
  "lists",
  {
    id: numeric().primaryKey(),
    created_at: timestamp().defaultNow().notNull(),
    word: text().notNull(),
    frequency: integer().notNull(),
    language_code: languageCodeEnum().notNull(),
    duration: real().notNull(),
    voice: text().notNull(),
    en_translation: text().notNull(),
  },
  (table) => [
    index("lists_language_code_idx").on(table.language_code),
    index("lists_frequency_idx").on(table.frequency),
  ]
);

export const sentencesTable = pgTable("sentences", {
  id: numeric().primaryKey(),
  created_at: timestamp().defaultNow().notNull(),
  lists_id: numeric()
    .references(() => listsTable.id, { onDelete: "cascade" })
    .notNull(),
  sentence: text().notNull(),
  en_translation: text().notNull(),
  context: text().notNull(),
  duration: real().notNull(),
  voice: text().notNull(),
});

export const itunesTable = pgTable("itunes", {
  id: numeric().primaryKey(),
  created_at: timestamp().defaultNow().notNull(),
});
