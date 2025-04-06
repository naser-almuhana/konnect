"use server"

import { getPostDataInclude } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"
import { createPostSchema } from "@/lib/validation"

export async function createPost(input: {
  content: string
  mediaIds: string[]
}) {
  const { content, mediaIds } = createPostSchema.parse(input)

  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

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

  return deletedPost
}
