"use client"

import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import type { CommentsPage } from "@/types/db.types"

import { createComment } from "@/lib/actions/comment.actions"

export function useCreateCommentMutation(postId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId]

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0]
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            }
          }
        },
      )

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data
        },
      })

      toast.success("Comment created")
    },
    onError(error) {
      console.error(error)
      toast.error("Failed to create comment. Please try again")
    },
  })

  return mutation
}
