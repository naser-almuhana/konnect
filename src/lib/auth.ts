import { headers } from "next/headers"
import { cache } from "react"

import { BetterAuthOptions, betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { username } from "better-auth/plugins"

import { db } from "@/lib/db"

export const auth = betterAuth({
  appName: "konnect_better_auth",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    modelName: "User",

    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // Automatically login the user in after signup.
    minPasswordLength: 8,
    maxPasswordLength: 20,
  },
  plugins: [username()],
} satisfies BetterAuthOptions)

export const validateRequest = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return {
      user: null,
      session: null,
    }
  }
  return session
})
