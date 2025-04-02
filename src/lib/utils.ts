import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// A delay function for test
export function delay(ms: number = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
