import { runDoctorCron } from "./jobs/doctor.ts";
import { runPopularizerCron } from "./jobs/popularizer.ts";
import { runScraperCron } from "./jobs/scraper.ts";
import { CronJob } from "cron";

if (process.env.NODE_ENV === "development") {
  process.loadEnvFile();
}

const jobType = process.env.JOB_TYPE as "scraper" | "popularizer" | "doctor";

// Every hour
CronJob.from({
  cronTime: "0 * * * *",
  onTick: runDoctorCron,
  start: jobType === "doctor",
});

// At 06:00 every day
CronJob.from({
  cronTime: "0 6 * * *",
  onTick: runPopularizerCron,
  start: jobType === "popularizer",
});

// At 0:30 every day
CronJob.from({
  cronTime: "43 0 * * *",
  onTick: runScraperCron,
  start: jobType === "scraper",
});
