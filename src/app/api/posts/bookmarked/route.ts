import { NextRequest } from "next/server"

import { PostsPage, getPostDataInclude } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

import { PER_PAGE } from "@/constants"

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const perPage = PER_PAGE

    const { user } = await validateRequest()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const bookmarks = await db.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: getPostDataInclude(user.id),
        },
      },
      orderBy: { createdAt: "desc" },
      take: perPage + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = bookmarks.length > perPage ? bookmarks[perPage].id : null

    const data: PostsPage = {
      posts: bookmarks.slice(0, perPage).map((bookmark) => bookmark.post),
      nextCursor,
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
