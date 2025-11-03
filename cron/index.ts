import { runDoctorCron } from "./jobs/doctor.ts";
import { runPopularizerCron } from "./jobs/popularizer.ts";
import { runScraperCron } from "./jobs/scraper.ts";

if (process.env.NODE_ENV === "development") {
  process.loadEnvFile();
}

const jobType = process.env.JOB_TYPE as "scraper" | "popularizer" | "doctor";

console.log(jobType, " hi");

if (jobType === "doctor") {
  runDoctorCron();
} else if (jobType === "popularizer") {
  runPopularizerCron();
} else if (jobType === "scraper") {
  runScraperCron();
}
