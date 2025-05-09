"use client"

import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import { PostsPage } from "@/types/db.types"

import { createPost } from "@/lib/actions/post.actions"
import { useSession } from "@/lib/auth-client"

type QueryFnDataType = InfiniteData<PostsPage, string | null>

type QueryFiltersType = QueryFilters<
  QueryFnDataType,
  Error,
  QueryFnDataType,
  readonly unknown[]
>

export function useCreatePostMutation() {
  const { data } = useSession()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate: (query) => {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(data?.user.id))
          )
        },
      } satisfies QueryFiltersType

      await queryClient.cancelQueries<QueryFnDataType>(queryFilter)

      queryClient.setQueriesData<QueryFnDataType>(queryFilter, (oldData) => {
        const firstPage = oldData?.pages[0]
        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                posts: [newPost, ...firstPage.posts],
                nextCursor: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          }
        }
      })

      queryClient.invalidateQueries<QueryFnDataType>({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data
        },
      })

      toast.success("Post created")
    },
    onError(error) {
      console.error(error)
      toast.error("Failed to post. Please try again.")
    },
  })

  return mutation
}
// "use client"

// import {
//   InfiniteData,
//   QueryFilters,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query"
// import { toast } from "sonner"

// import { PostsPage } from "@/types/db.types"

// import { createPost } from "@/lib/actions/post.actions"

// export function useCreatePostMutation() {
//   const queryClient = useQueryClient()

//   const mutation = useMutation({
//     mutationFn: createPost, // Function to execute when mutation is triggered
//     onSuccess: async (newPost) => {
//       // Define query filter for the post feed
//       const queryFilter = {
//         queryKey: ["post-feed", "for-you"],
//       } satisfies QueryFilters

//       // Cancel any ongoing queries related to the post feed to prevent conflicts
//       await queryClient.cancelQueries(queryFilter)

//       // Update cached data for the post feed to optimistically include the new post
//       queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
//         queryFilter,
//         (oldData) => {
//           const firstPage = oldData?.pages[0] // Get the first page of posts
//           if (firstPage) {
//             return {
//               pageParams: oldData.pageParams,
//               pages: [
//                 {
//                   posts: [newPost, ...firstPage.posts], // Prepend new post to the list
//                   nextCursor: firstPage.nextCursor, // Maintain pagination state
//                 },
//                 ...oldData.pages.slice(1), // Preserve remaining pages
//               ],
//             }
//           }
//         },
//       )

//       // If the first page is not loaded yet and a post is created, invalidate queries to refetch data
//       queryClient.invalidateQueries({
//         queryKey: queryFilter.queryKey,
//         predicate(query) {
//           return !query.state.data // Only invalidate queries that have no data yet
//         },
//       })

//       toast.success("Post created") // Show success notification
//     },
//     onError(error) {
//       console.error(error) // Log error to console
//       toast.error("Failed to post. Please try again.") // Show error notification
//     },
//   })

//   return mutation // Return mutation object to be used in components
// }
