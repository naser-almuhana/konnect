import { type ClassValue, clsx } from "clsx"
import { formatDate, formatDistanceToNowStrict } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date()
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true })
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d")
    } else {
      return formatDate(from, "MMM d, yyyy")
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)
}

// Utility to convert any string to a safe URL-friendly format
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumerics
    .replace(/[\s_-]+/g, "-") // replace spaces/underscores with dashes
    .replace(/^-+|-+$/g, "") // remove leading/trailing dashes
}

// A delay function for test
export function delay(ms: number = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
