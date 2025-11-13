import { runDoctorCron } from "./jobs/doctor.ts";
import { runPopularizerCron } from "./jobs/popularizer.ts";
import { runScraperCron } from "./jobs/scraper.ts";
import cron from "node-cron";

if (process.env.NODE_ENV === "development") {
  process.loadEnvFile();
}

const jobType = process.env.JOB_TYPE as "scraper" | "popularizer" | "doctor";

// Db backup is run at 12:00 every day, it takes about 10 min with 1 core

if (jobType === "scraper") {
  // At 00:00 every day
  cron.schedule("0 0 * * *", runScraperCron);
} else if (jobType === "doctor") {
  // Every hour
  cron.schedule("15 * * * *", runDoctorCron);
} else if (jobType === "popularizer") {
  // At 06:00 every day
  cron.schedule("0 6 * * *", runPopularizerCron);
}
