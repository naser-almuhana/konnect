import { z } from "zod"

const requiredString = z.string().trim().min(1, "Required")

// Auth
export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
})

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
})
