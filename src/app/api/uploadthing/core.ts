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
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "512KB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const { user } = await validateRequest()

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
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
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
