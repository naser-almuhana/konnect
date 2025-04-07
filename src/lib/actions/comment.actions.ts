"use server"

import { type PostData, getCommentDataInclude } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"
import { createCommentSchema } from "@/lib/validation"

type CreateCommentInput = {
  post: PostData
  content: string
}

export async function createComment({ post, content }: CreateCommentInput) {
  const { content: validatedContent } = createCommentSchema.parse({ content })

  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  const [newComment] = await db.$transaction([
    db.comment.create({
      data: {
        content: validatedContent,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.user.id !== user.id
      ? [
          db.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              postId: post.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ])

  return newComment
}

export async function deleteComment(id: string) {
  const { user } = await validateRequest()
  if (!user) throw new Error("Unauthorized")

  const comment = await db.comment.findUnique({
    where: { id },
  })

  if (!comment) throw new Error("Comment not found")
  if (comment.userId !== user.id) throw new Error("Unauthorized")

  const deletedComment = await db.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  })

  return deletedComment
}
