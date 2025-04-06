import { UTApi } from "uploadthing/server"

import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      })
    }

    const unusedMedia = await db.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    })

    new UTApi().deleteFiles(
      unusedMedia.map(
        (m) =>
          m.url.split(
            `https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/`,
          )[1],
      ),
    )

    await db.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((m) => m.id),
        },
      },
    })

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
