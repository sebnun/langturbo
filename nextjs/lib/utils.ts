import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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