"use server"

import { notFound } from "next/navigation"
import { cache } from "react"

import { getUserDataSelect } from "@/types/db.types"

import { db } from "@/lib/db"

export const getUser = cache(
  async (username: string, loggedInUserId: string) => {
    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUserId),
    })

    if (!user) notFound()

    return user
  },
)
