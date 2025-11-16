import { db } from "@/db";
import { showsTable } from "@/db/schema";
import { and, arrayContains, eq } from "drizzle-orm";
import ShowItem from "./ShowItem";

const ShowsLoader = async ({ lang, catId }: { lang: string; catId?: number }) => {
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
        .limit(20);

  return showsRows.map((row) => (
    <ShowItem key={row.id} id={row.id} title={row.title} imageUrl={row.image_url} author={row.author} />
  ));
};

export default ShowsLoader;
