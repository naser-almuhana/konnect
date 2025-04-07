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

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
})

export const updateUserProfileSchema = z.object({
  displayUsername: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
})

export const createCommentSchema = z.object({
  content: requiredString,
})
