import { console } from "inspector";
import Sitemapper from "sitemapper";
import { db } from "../db/index.ts";
import { showsTable } from "../db/schema.ts";
import { processItunesId } from "../lib/processor.ts";
import { eq } from "drizzle-orm";

export const runScraperCron = async () => {
  console.log("Running scraper cron job...");

  const Sitemap = new Sitemapper({
    url: process.env.ITUNES_SITEMAP_URL,
  });
  const { sites } = await Sitemap.fetch();

  const ids = new Set<string>();
  for (const url of sites) {
    const id = url.split("/").pop()!.replace("id", "");
    ids.add(id);
  }

  const idsArray = Array.from(ids);
  let notOnDb = 0;

  console.log(`Found ${idsArray.length} unique podcast IDs from sitemap`);

  for (const id of idsArray) {
    const count = await db.$count(showsTable, eq(showsTable.source_id, id));

    if (count === 0) {
      notOnDb++;
      await processItunesId(id);
    }
  }

  console.log("Not on db", notOnDb);
};
