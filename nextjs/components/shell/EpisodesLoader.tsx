import { db } from "@/db";
import { episodesTable, showsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import EpisodeItem from "./EpisodeItem";

const EpisodesLoader = async ({ lang }: { lang: string }) => {
  const episodeShowRows = await db
    .select()
    .from(episodesTable)
    .where(eq(episodesTable.language_code, lang))
    .orderBy(episodesTable.last_played_at)
    .limit(3)
    .leftJoin(showsTable, eq(showsTable.id, episodesTable.show_id));

  return episodeShowRows.map((row) => (
    <EpisodeItem
      key={row.episodes.id}
      id={row.episodes.id}
      title={row.episodes.title}
      showId={row.shows!.id}
      showImageUrl={row.shows!.image_url}
      showTitle={row.shows!.title}
      showAuthor={row.shows?.author}
    />
  ));
};

export default EpisodesLoader;
