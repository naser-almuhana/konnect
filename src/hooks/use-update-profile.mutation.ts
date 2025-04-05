"use client"

import { useRouter } from "next/navigation"

import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import { PostsPage, UpdateUserProfileValues } from "@/types/db.types"

import { updateUserProfile } from "@/lib/actions/user.actions"
import { useUploadThing } from "@/lib/uploadthing"

type MutationFnOptions = { values: UpdateUserProfileValues; userImage?: File }

export function useUpdateProfileMutation() {
  const router = useRouter()

  const queryClient = useQueryClient()

  const { startUpload: startUserImageUpload } = useUploadThing("userImage")

  const mutation = useMutation({
    mutationFn: async ({ values, userImage }: MutationFnOptions) => {
      return Promise.all([
        updateUserProfile(values),
        userImage && startUserImageUpload([userImage]),
      ])
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newImageUrl = uploadResult?.[0].serverData?.userImage
      console.log({ uploadResult })
      const queryFilter = {
        queryKey: ["post-feed"],
      } satisfies QueryFilters

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      image: newImageUrl || updatedUser.image,
                    },
                  }
                }
                return post
              }),
            })),
          }
        },
      )

      router.refresh()

      toast.success("Profile updated")
    },

    onError(error) {
      console.error(error)
      toast.error("Failed to update profile. Please try again.")
    },
  })

  return mutation
}
