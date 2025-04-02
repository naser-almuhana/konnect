import { NextRequest, NextResponse } from "next/server"

import { PostsPage, getPostDataInclude } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"
import { delay } from "@/lib/utils"

import { PER_PAGE } from "@/constants"

export async function GET(req: NextRequest) {
  try {
    await delay(500)
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const perPage = PER_PAGE

    const { user } = await validateRequest()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const posts = await db.post.findMany({
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

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
