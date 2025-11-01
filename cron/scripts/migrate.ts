import { Client } from "pg";

process.loadEnvFile();
const client = new Client({ connectionString: process.env.LEGACY_DATABASE_URL });

const main = async () => {
  await client.connect();

  const result = await client.query("SELECT * from content limit 1");
  console.log(result);

  await client.end();
};

main();
