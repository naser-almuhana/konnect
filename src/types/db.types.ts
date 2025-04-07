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
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
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

// COMMENTS
export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>
}>

export interface CommentsPage {
  comments: CommentData[]
  previousCursor: string | null
}

// NOTIFICATIONS
export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayUsername: true,
      image: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude
}>

export interface NotificationsPage {
  notifications: NotificationData[]
  nextCursor: string | null
}

export interface NotificationCountInfo {
  unreadCount: number
}

// OTHERS
export interface FollowerInfo {
  followersCount: number
  isFollowedByUser: boolean
}

export interface LikeInfo {
  likesCount: number
  isLikedByUser: boolean
}
export interface BookmarkInfo {
  isBookmarkedByUser: boolean
}

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>
