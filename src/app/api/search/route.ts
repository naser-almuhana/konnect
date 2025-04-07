import { NextRequest } from "next/server"

import { PostsPage, getPostDataInclude } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

import { PER_PAGE } from "@/constants"

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || ""
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const searchQuery = q.split(" ").join(" & ")

    const perPage = PER_PAGE

    const { user } = await validateRequest()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const posts = await db.post.findMany({
      where: {
        OR: [
          { content: { search: searchQuery } },
          { user: { displayUsername: { search: searchQuery } } },
          { user: { username: { search: searchQuery } } },
        ],
      },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: perPage + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor = posts.length > perPage ? posts[perPage].id : null

    const data: PostsPage = {
      posts: posts.slice(0, perPage),
      nextCursor,
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
