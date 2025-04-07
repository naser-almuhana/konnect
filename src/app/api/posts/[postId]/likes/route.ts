import type { PostIdParams } from "@/types"
import type { LikeInfo } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: PostIdParams) {
  try {
    const { postId } = await params

    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 })

    const post = await db.post.findUnique({
      where: { id: postId },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })
    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 })

    const data: LikeInfo = {
      likesCount: post._count.likes,
      isLikedByUser: !!post.likes.length,
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: PostIdParams) {
  try {
    const { postId } = await params

    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 })

    const post = await db.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    })
    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 })

    await db.$transaction([
      db.like.upsert({
        where: {
          userId_postId: {
            userId: loggedInUser.id,
            postId,
          },
        },
        create: {
          userId: loggedInUser.id,
          postId,
        },
        update: {},
      }),
      ...(loggedInUser.id !== post.userId
        ? [
            db.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ])

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: PostIdParams) {
  try {
    const { postId } = await params

    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 })

    const post = await db.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    })
    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 })

    await db.$transaction([
      // delete many will not throw error of not exiting
      db.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId,
        },
      }),
      db.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId,
          type: "LIKE",
        },
      }),
    ])

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
