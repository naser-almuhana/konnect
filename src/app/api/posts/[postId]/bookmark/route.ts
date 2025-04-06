import type { PostIdParams } from "@/types"
import type { BookmarkInfo } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: PostIdParams) {
  try {
    const { postId } = await params

    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 })

    const bookmark = await db.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
    })

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
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

    await db.bookmark.upsert({
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
    })

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

    await db.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    })

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
