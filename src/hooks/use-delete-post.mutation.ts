"use client"

import { usePathname, useRouter } from "next/navigation"

import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import { PostsPage } from "@/types/db.types"

import { deletePost } from "@/lib/actions/post.actions"

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: deletePost, // Function to execute when mutation is triggered
    onSuccess: async (deletedPost) => {
      // Define query filter for the post feed
      const queryFilter = {
        queryKey: ["post-feed"],
      } satisfies QueryFilters

      // Cancel any ongoing queries related to the post feed to prevent conflicts
      await queryClient.cancelQueries(queryFilter)

      // Update cached data for the post feed to remove the deleted post
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return // Return early if no cached data exists

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor, // Maintain pagination state
              posts: page.posts.filter((p) => p.id !== deletedPost.id), // Remove the deleted post
            })),
          }
        },
      )

      toast.success("Post deleted") // Show success notification

      // If the user is viewing the deleted post's page, redirect them to the user's profile
      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`)
      }
    },
    onError(error) {
      console.error(error) // Log error to console
      toast.error("Failed to delete post. Please try again.") // Show error notification
    },
  })

  return mutation // Return mutation object to be used in components
}
