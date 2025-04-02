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
