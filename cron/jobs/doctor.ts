import { db } from "../db/index.ts";
import { showsTable } from "../db/schema.ts";

export const runDoctorCron = async () => {
  const shows = await db.select().from(showsTable);
  console.log('Getting all shows from the database: ', shows)
  console.log("Running doctor cron job...");
};
