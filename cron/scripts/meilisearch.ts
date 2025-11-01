import { MeiliSearch } from "meilisearch";
import { ISO_LANGUAGE_CODES } from "../lib/languages.ts";

/*

shows
{
    id: db uuid
    title
    author
}

captions
{
    id: db uuid
    caption
    show_id
}

*/

process.loadEnvFile();

const client = new MeiliSearch({
  host: process.env.MEILI_URL,
  apiKey: process.env.MEILI_MASTER_KEY,
});

const createIndexes = async () => {
  for (const code of ISO_LANGUAGE_CODES) {
    const task1 = await client.createIndex(`captions_${code}`, {
      primaryKey: "id",
    });
    console.log(task1);

    const task2 = await client.createIndex(`shows_${code}`, {
      primaryKey: "id",
    });
    console.log(task2);
    console.log(code);
  }
};

const deleteIndexes = async () => {
  for (const code of ISO_LANGUAGE_CODES) {
    const task1 = await client.deleteIndexIfExists(`captions_${code}`);
    console.log(task1);

    const task2 = await client.deleteIndexIfExists(`shows_${code}`);
    console.log(task2);
    console.log(code);
  }
};

const updateIndexes = async () => {
  for (const code of ISO_LANGUAGE_CODES) {
    // By default, all fields in a document are both displayed and searchable

    const task1 = await client.index(`captions_${code}`).updateSearchableAttributes(["caption"]);
    console.log(task1);

    const task2 = await client.index(`shows_${code}`).updateSearchableAttributes(
      ["title", "author"] // sorted by order of importance
    );
    console.log(task2);

    const task3 = await client.index(`captions_${code}`).updateFilterableAttributes(["show_id"]);
    console.log(task3);

    // .updateSettings is not working
  }
};

const info = async () => {
  // const task1 = await client.index('podcasts_1').getSettings();
  // console.log(task1);

  const stats = await client.getStats()
  let totalDocuments = 0;
  for (const index in stats.indexes) {
    totalDocuments += stats.indexes[index].numberOfDocuments;
  }
  console.log(totalDocuments, stats);
};

const search = async () => {
  //const search = await client.index('podcasts_1').search('hi')
  const search = await client.index('podcasts_1').search('', {
    //filter: 'categories IN [1318]',
    filter: 'isPopular = true',
    sort: ['updatedAt:asc'],
    limit: 10
  })
  console.log(search.hits);
}

//deleteIndexes()
//createIndexes();
updateIndexes();
//info();
//search();