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

export const affiliateLinks: Record<string, string> = {
  //english: "",
  chinese: "https://amzn.to/4ipgAF6",
  german: "https://amzn.to/4irRJAB",
  spanish: "https://amzn.to/3F6LZhg",
  russian: "https://amzn.to/41OARNV",
  korean: "https://amzn.to/41OAUcz",
  french: "https://amzn.to/3F9W5Om",
  japanese: "https://amzn.to/3XxNT0R",
  portuguese: "https://amzn.to/43k62Tw",
  turkish: "https://amzn.to/4h9rgXn",
  polish: "https://amzn.to/43k66CK",
  catalan: "https://amzn.to/4h5YIhu",
  dutch: "https://amzn.to/3DadDtf",
  arabic: "https://amzn.to/4kvOeuA",
  swedish: "https://amzn.to/4i4PRhu",
  italian: "https://amzn.to/4isUTE7",
  indonesian: "https://amzn.to/4kuQMZX",
  hindi: "https://amzn.to/4kqBQw5",
  finnish: "https://amzn.to/4kvZAia",
  vietnamese: "https://amzn.to/4kuRRRB",
  hebrew: "https://amzn.to/41OB9nZ",
  ukrainian: "https://amzn.to/41s2zQk",
  greek: "https://amzn.to/4bwxLlY",
  malay: "https://amzn.to/3QNLU4x",
  czech: "https://amzn.to/4bwVjHj",
  romanian: "https://amzn.to/3FkEZNJ",
  danish: "https://amzn.to/4itncCl",
  hungarian: "https://amzn.to/41wNDAe",
  tamil: "https://amzn.to/3XxOfVf",
  norwegian: "https://amzn.to/41LaR7g",
  thai: "https://amzn.to/4i5wk09",
  urdu: "https://amzn.to/43pg2uw",
  croatian: "https://amzn.to/3QMRPXH",
  bulgarian: "https://amzn.to/3Dme5o7",
  lithuanian: "https://amzn.to/3XzvL6D",
  slovak: "https://amzn.to/3Do5EZB",
  persian: "https://amzn.to/3XrVy0w",
  latvian: "https://amzn.to/4i8y60y",
  serbian: "https://amzn.to/41vPky0",
  azerbaijani: "https://amzn.to/43r26Au",
  slovenian: "https://amzn.to/43rAyea",
  estonian: "https://amzn.to/43pFeB5",
  macedonian: "https://amzn.to/3QLGzuv",
  icelandic: "https://amzn.to/4iv10bd",
  armenian: "https://amzn.to/4kpnSuh",
  marathi: "https://amzn.to/4heo5xw",
  afrikaans: "https://amzn.to/3F7rKjz",
};