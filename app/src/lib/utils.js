import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// The API returns dates as "yyyy-MM-dd" (or an ISO timestamp). Parsing
// by parts (rather than `new Date(dateString)`) avoids UTC/local
// timezone shifts moving the day for date-only strings.
export function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}
