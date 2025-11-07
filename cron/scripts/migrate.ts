import { Client } from "pg";
import { db } from "../db/index.ts";
import { showsTable, listsTable, sentencesTable } from "../db/schema.ts";

process.loadEnvFile();
const client = new Client({ connectionString: process.env.LEGACY_DATABASE_URL });

const getLanguageCodeById = (id: number) => {
  return Object.keys(languageIds).find((key) => languageIds[key] === id);
};

const languageIds: { [key: string]: number } = {
  en: 1,
  zh: 2,
  es: 4,
  de: 3,
  ru: 5,
  ko: 6,
  fr: 7,
  ja: 8,
  pt: 9,
  tr: 10,
  pl: 11,
  ca: 12,
  nl: 13,
  ar: 14,
  sv: 15,
  it: 16,
  id: 17,
  hi: 18,
  fi: 19,
  vi: 20,
  he: 21,
  uk: 22,
  el: 23,
  ms: 24,
  cs: 25,
  ro: 26,
  da: 27,
  hu: 28,
  ta: 29,
  no: 30, // ATTN
  nb: 30, // ATTN
  nn: 30, // ATTN
  th: 31,
  ur: 32,
  hr: 33,
  bg: 34,
  lt: 35,
  sk: 36,
  fa: 37,
  lv: 38,
  sr: 39,
  az: 40,
  sl: 41,
  et: 43,
  mk: 44,
  is: 45,
  hy: 46,
  mr: 48,
  af: 49,
  //tl: 50,
};

const migrateContent = async () => {
  await client.connect();

  const batchSize = 2000;
  let offset = 0;
  let hasMore = true;

  // 3099272 total at legacy
  // But im skipping with no language code

  while (hasMore) {
    const query = `
        SELECT *
        FROM content
        ORDER BY id
        LIMIT $1 OFFSET $2
      `;
    const values = [batchSize, offset];

    console.log(offset);

    const res = await client.query(query, values);
    const rows = res.rows;

    const rowsToInsert = [];

    for (const row of rows) {
      const source_id = row.id;
      const title = row.title;
      const description = row.description;
      const author = row.author;
      const explicit = row.explicit;
      const image_url = row.image_url;
      const show_url = null;
      const source_url = row.feed_url;
      const country = row.country;
      const category_ids = row.category_ids;
      const popularity = row.popularity_count;
      const language_code = getLanguageCodeById(row.language_id);

      if (!language_code) {
        //console.error("no language code", row.id, language_code);
        continue;
      }

      rowsToInsert.push({
        source_id,
        title,
        description,
        author,
        explicit,
        image_url,
        show_url,
        source_url,
        country,
        category_ids,
        popularity,
        language_code,
      });
    }

    await db.insert(showsTable).values(rowsToInsert);

    if (rows.length < batchSize) {
      hasMore = false; // No more rows left
    } else {
      offset += batchSize;
    }
  }

  console.log("done");

  await client.end();
};

const migrateLists = async () => {
  await client.connect();

  const languageId = 44
  const batchSize = 2000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const query = `
        SELECT *
        FROM lists
        WHERE language_id = $1
        AND duration != -1
        ORDER BY id
        LIMIT $2 OFFSET $3
      `;
    const values = [languageId, batchSize, offset];

    console.log(offset, languageId);

    const res = await client.query(query, values);
    const rows = res.rows;

    for (const row of rows) {
      const word = row.word;
      const frequency = row.frequency;
      const language_code = getLanguageCodeById(row.language_id);
      const duration = row.duration;
      const voice = row.voice;
      const en_translation = row.en_translation;

      const listsRows = await db
        .insert(listsTable)
        .values({ word, frequency, language_code, duration, voice, en_translation })
        .returning();

      const newListsId = listsRows[0].id;

      const { rows: sentencesRows } = await client.query("SELECT * FROM sentences where lists_id = $1", [row.id]);

      const sentecesToInsert = [];
      for (const sentenceRow of sentencesRows) {
        sentecesToInsert.push({
          lists_id: newListsId,
          sentence: sentenceRow.sentence,
          en_translation: sentenceRow.en_translation,
          context: sentenceRow.context,
          duration: sentenceRow.duration,
          voice: sentenceRow.voice || 'no voice',
        });

        await db.insert(sentencesTable).values(sentecesToInsert);
      }
    }

    if (rows.length < batchSize) {
      hasMore = false; // No more rows left
    } else {
      offset += batchSize;
    }
  }

  console.log("done");

  await client.end();
};

//migrateContent();
migrateLists();
