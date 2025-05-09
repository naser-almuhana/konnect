import * as icons from "lucide-react"
import { LucideProps } from "lucide-react"
import { z } from "zod"

import { loginSchema, signUpSchema } from "@/lib/validation"

// Auth
export type SignUpValues = z.infer<typeof signUpSchema>
export type LoginValues = z.infer<typeof loginSchema>

// ui
export type IconType = {
  name: keyof typeof icons
  props?: LucideProps
}

export type UsernameParams = { params: Promise<{ username: string }> }
export type UserIdParams = { params: Promise<{ userId: string }> }
export type PostIdParams = { params: Promise<{ postId: string }> }
export type SearchParams = { searchParams: Promise<{ q: string }> }
