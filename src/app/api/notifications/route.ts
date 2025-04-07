import { NextRequest } from "next/server"

import { NotificationsPage, notificationsInclude } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

import { PER_PAGE } from "@/constants"

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const perPage = PER_PAGE

    const { user } = await validateRequest()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notifications = await db.notification.findMany({
      where: { recipientId: user.id },
      include: notificationsInclude,
      orderBy: { createdAt: "desc" },
      take: perPage + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const nextCursor =
      notifications.length > perPage ? notifications[perPage].id : null

    const data: NotificationsPage = {
      notifications: notifications.slice(0, perPage),
      nextCursor,
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
