import type { UserIdParams } from "@/types"
import type { FollowerInfo } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: UserIdParams) {
  try {
    const { userId } = await params

    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 })

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    })
    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 })

    const data: FollowerInfo = {
      followersCount: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: UserIdParams) {
  try {
    const { userId } = await params

    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 })

    await db.$transaction([
      // upsert will ignore if there is problem instead of create
      db.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: loggedInUser.id,
            followingId: userId,
          },
        },
        create: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
        update: {},
      }),
      db.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ])

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: UserIdParams) {
  try {
    const { userId } = await params

    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 })

    await db.$transaction([
      // delete many will not throw error of not exiting
      db.follow.deleteMany({
        where: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      }),
      db.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ])

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
