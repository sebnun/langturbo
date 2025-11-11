import { runDoctorCron } from "./jobs/doctor.ts";
import { runPopularizerCron } from "./jobs/popularizer.ts";
import { runScraperCron } from "./jobs/scraper.ts";
import { CronJob } from "cron";

if (process.env.NODE_ENV === "development") {
  process.loadEnvFile();
}

const jobType = process.env.JOB_TYPE as "scraper" | "popularizer" | "doctor";

// Every hour
const doctorCron = new CronJob("0 * * * *", runDoctorCron);

// At 06:00 every day
const popularizerCron = new CronJob("0 6 * * *", runPopularizerCron);

// At 0:30 every day
const scraperCron = new CronJob("30 0 * * *", runScraperCron);

if (jobType === "doctor") {
  doctorCron.start();
} else if (jobType === "popularizer") {
  popularizerCron.start();
} else {
  scraperCron.start();
}