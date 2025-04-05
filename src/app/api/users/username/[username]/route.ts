import { NextResponse } from "next/server"

import { UsernameParams } from "@/types"
import { getUserDataSelect } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: UsernameParams) {
  try {
    const { user: loggedInUser } = await validateRequest()
    if (!loggedInUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { username } = await params

    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUser.id),
    })

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
