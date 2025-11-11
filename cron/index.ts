import { runDoctorCron } from "./jobs/doctor.ts";
import { runPopularizerCron } from "./jobs/popularizer.ts";
import { runScraperCron } from "./jobs/scraper.ts";
import { CronJob } from "cron";

if (process.env.NODE_ENV === "development") {
  process.loadEnvFile();
}

const jobType = process.env.JOB_TYPE as "scraper" | "popularizer" | "doctor";

// Every hour
const d = CronJob.from({
  cronTime: "0 * * * *",
  onTick: runDoctorCron,
  start: jobType === "doctor",
});

console.log(d.isActive, d.cronTime, "doctor");

// At 06:00 every day
const p = CronJob.from({
  cronTime: "0 6 * * *",
  onTick: runPopularizerCron,
  start: jobType === "popularizer",
});

console.log(p.isActive, p.cronTime, "popularizer");

// At 0:55 every day
const s = CronJob.from({
  cronTime: "55 0 * * *",
  onTick: runScraperCron,
  start: jobType === "scraper",
});

console.log(s.isActive, s.cronTime, "scraper");
