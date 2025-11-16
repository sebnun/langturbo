import { db } from "@/db";
import { showsTable } from "@/db/schema";
import { and, arrayContains, eq } from "drizzle-orm";
import ShowItem from "./ShowItem";

const ShowsLoader = async ({ lang, limit, catId }: { lang: string; limit: number, catId?: number }) => {
  const showsRows = catId
    ? await db
        .select()
        .from(showsTable)
        .where(and(eq(showsTable.language_code, lang), arrayContains(showsTable.category_ids, [catId])))
        .orderBy(showsTable.popularity)
        .limit(20)
    : await db
        .select()
        .from(showsTable)
        .where(eq(showsTable.language_code, lang))
        .orderBy(showsTable.popularity)
        .limit(limit);

  return showsRows.map((row) => (
    <ShowItem lang={lang} key={row.id} id={row.id} title={row.title} imageUrl={row.image_url} author={row.author} />
  ));
};

export default ShowsLoader;
