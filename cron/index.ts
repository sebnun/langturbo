import { runDoctorCron } from "./jobs/doctor.ts";
import { runPopularizerCron } from "./jobs/popularizer.ts";
import { runScraperCron } from "./jobs/scraper.ts";

process.loadEnvFile()

const jobType = process.env.JOB_TYPE as "scraper" | "popularizer" | "doctor";

if (jobType === "doctor") {
  runDoctorCron();
} else if (jobType === "popularizer") {
  runPopularizerCron();
} else if (jobType === "scraper") {
  runScraperCron();
} 
