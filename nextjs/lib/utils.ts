import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { decode } from 'html-entities';
import dayjs from "dayjs";
import "dayjs/locale/en";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDatabaseUri = () => {
  return `postgresql://postgres:${process.env.POSTGRES_PASSWORD!}@${
    process.env.NODE_ENV === "development" ? "127.0.0.1" : "nextjs-postgres"
  }:5432/langturbo`;
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getOrdinal(n: number) {
  let ord = "th";

  if (n % 10 == 1 && n % 100 != 11) {
    ord = "st";
  } else if (n % 10 == 2 && n % 100 != 12) {
    ord = "nd";
  } else if (n % 10 == 3 && n % 100 != 13) {
    ord = "rd";
  }

  return ord;
}

export function convertSecondsDurationToHuman(seconds?: number) {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    return "Unknown duration";
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? h + ":" : "";
  const mDisplay = m > 0 ? (m > 9 ? m + ":" : "0" + m + ":") : "00:";
  const sDisplay = s > 9 ? s : `0${s}`;

  return hDisplay + mDisplay + sDisplay;
}

export function convertDateToHuman(date: string) {
  return dayjs(date).locale("en").format("MMMM D, YYYY");
}

export const stripHtml = (html: string) => {
  try {
    return decode(html.replace(/<[^>]*>?/gi, "")).trim();
  } catch (e) {
    console.error("Failed to strip html", html, e);
    return "";
  }
};