import { headers } from "next/headers"
import { cache } from "react"

import { BetterAuthOptions, betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { username } from "better-auth/plugins"

import { db } from "@/lib/db"
import { slugify } from "@/lib/utils"
import { usernameValidator } from "@/lib/validation"

export const auth = betterAuth({
  appName: "konnect_better_auth",
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
  plugins: [
    username({
      usernameValidator(username) {
        const validateUsername = usernameValidator.safeParse(username)

        if (!validateUsername.success) {
          return false
        }
        return true
      },
    }),
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          username: slugify(profile.given_name),
          displayUsername: profile.given_name,
        }
      },
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          username: slugify(profile.name),
          displayUsername: profile.name,
          bio: profile.bio,
        }
      },
    },
  },
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
