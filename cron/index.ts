import { runDoctorCron } from "./jobs/doctor.ts";
import { runPopularizerCron } from "./jobs/popularizer.ts";
import { runScraperCron } from "./jobs/scraper.ts";
import cron from "node-cron";

if (process.env.NODE_ENV === "development") {
  process.loadEnvFile();
}

const jobType = process.env.JOB_TYPE as "scraper" | "popularizer" | "doctor";

if (jobType === "scraper") {
  // At 01:07 every day
  cron.schedule("07 1 * * *", runScraperCron);
} else if (jobType === "doctor") {
  // Every hour
  cron.schedule("0 * * * *", runDoctorCron);
} else if (jobType === "popularizer") {
  // At 06:00 every day
  cron.schedule("0 6 * * *", runPopularizerCron);
}
