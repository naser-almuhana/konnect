"use server"

import { revalidateTag } from "next/cache"
import { notFound } from "next/navigation"
import { cache } from "react"

import { getPostDataInclude } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"
import { createPostSchema } from "@/lib/validation"

export const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  })

  if (!post) notFound()

  return post
})

export async function createPost(input: {
  content: string
  mediaIds: string[]
}) {
  const { content, mediaIds } = createPostSchema.parse(input)

  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  // Extract mentions (@username)
  const mentionedUsernames = content.match(/@(\w+)/g) || []

  // Find users who were mentioned
  const mentionedUsers = await db.user.findMany({
    where: {
      username: {
        in: mentionedUsernames.map((mention) => mention.slice(1)), // Remove "@" from each mention
      },
    },
  })

  const newPost = await db.post.create({
    include: getPostDataInclude(user.id),
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
  })

  // Create notifications for mentioned users
  for (const mentionedUser of mentionedUsers) {
    await db.notification.create({
      data: {
        issuerId: user.id, // The user who made the post
        recipientId: mentionedUser.id, // The mentioned user
        postId: newPost.id,
        type: "MENTION", // You can create a custom notification type for mentions
      },
    })
  }

  revalidateTag("trending_topics")

  return newPost
}

export async function deletePost(id: string) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  const post = await db.post.findUnique({
    where: { id },
  })
  if (!post) throw new Error("Post not found")
  if (post.userId !== user.id) throw new Error("Unauthorized")

  const deletedPost = await db.post.delete({
    where: { id: post.id },
    include: getPostDataInclude(user.id),
  })

  revalidateTag("trending_topics")
  return deletedPost
}
