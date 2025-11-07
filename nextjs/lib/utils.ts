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