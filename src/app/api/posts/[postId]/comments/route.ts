import { NextRequest } from "next/server"

import { PostIdParams } from "@/types"
import { CommentsPage, getCommentDataInclude } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

import { PER_PAGE } from "@/constants"

export async function GET(req: NextRequest, { params }: PostIdParams) {
  try {
    const { postId } = await params
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const { user } = await validateRequest()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const comments = await db.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: -PER_PAGE - 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const previousCursor = comments.length > PER_PAGE ? comments[0].id : null

    const data: CommentsPage = {
      comments: comments.length > PER_PAGE ? comments.slice(1) : comments,
      previousCursor,
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
