import { Prisma } from "@prisma/client"
import { z } from "zod"

import { updateUserProfileSchema } from "@/lib/validation"

// USER
export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayUsername: true,
    image: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>
}>

// POST
export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.PostInclude
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>
}>

export interface PostsPage {
  posts: PostData[]
  nextCursor: string | null
}

export interface FollowerInfo {
  followersCount: number
  isFollowedByUser: boolean
}

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>
