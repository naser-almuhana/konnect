import { type FileRouter, createUploadthing } from "uploadthing/next"
import { UTApi, UploadThingError } from "uploadthing/server"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  userImage: f({
    image: {
      maxFileSize: "512KB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const { user } = await validateRequest()
      if (!user) throw new UploadThingError("Unauthorized")
      return { user }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldUserImage = metadata.user.image

      if (oldUserImage) {
        const key = oldUserImage.split(
          `https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/`,
        )[1]
        await new UTApi().deleteFiles(key)
      }

      const newUserImageUrl = file.ufsUrl

      await Promise.all([
        db.user.update({
          where: { id: metadata.user.id },
          data: {
            image: newUserImageUrl,
          },
        }),
        // streamServerClient.partialUpdateUser({
        //   id: metadata.user.id,
        //   set: {
        //     image: newAvatarUrl,
        //   },
        // }),
      ])

      return { userImage: newUserImageUrl }
    }),

  // Attachment
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest()
      if (!user) throw new UploadThingError("Unauthorized")
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      const mediaUrl = file.ufsUrl

      const media = await db.media.create({
        data: {
          url: mediaUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      })

      return { mediaId: media.id }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
