"use client"

import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import { CommentsPage } from "@/types/db.types"

import { deleteComment } from "@/lib/actions/comment.actions"

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId]

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter((c) => c.id !== deletedComment.id),
            })),
          }
        },
      )

      toast.success("Comment deleted")
    },
    onError(error) {
      console.error(error)
      toast.error("Failed to delete post. Please try again.")
    },
  })

  return mutation
}
