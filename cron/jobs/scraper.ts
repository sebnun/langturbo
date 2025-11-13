import Sitemapper from "sitemapper";
import { db } from "../db/index.ts";
import { itunesTable } from "../db/schema.ts";
import { processItunesId } from "../lib/processor.ts";

// It takes at least 6 hours to scrape the sitemap checking only the shows table
// Keep all seen itunes ids on its own table, a podcast is unlikely to become usable if it fails here

export const runScraperCron = async () => {
  console.log("Running scraper cron job...");

  const Sitemap = new Sitemapper({
    url: process.env.ITUNES_SITEMAP_URL,
  });
  const { sites } = await Sitemap.fetch();

  const ids = new Set<string>();
  for (const url of sites) {
    const id = url
      .split("/")
      .pop()!
      .replace("id", "")
      .replace(/(\d+).*/, "$1");
    ids.add(id);
  }

  console.log(`Found ${ids.size} unique podcast IDs from sitemap`);

  const seenItunesIdsRows = await db.select({ id: itunesTable.id }).from(itunesTable);
  const seenItunesIds = new Set(seenItunesIdsRows.map((sid) => sid.id));

  const newIds = ids.difference(seenItunesIds);

  for (const id of newIds) {
    await processItunesId(id);
  }

  await db.insert(itunesTable).values(Array.from(newIds).map((id) => ({ id })));
  console.log("Not on db", newIds.size);
};
