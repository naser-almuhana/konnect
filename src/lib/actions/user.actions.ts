"use server"

import { notFound } from "next/navigation"
import { cache } from "react"

import { UpdateUserProfileValues, getUserDataSelect } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"
import { updateUserProfileSchema } from "@/lib/validation"

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

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values)

  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  })

  return updatedUser
}
