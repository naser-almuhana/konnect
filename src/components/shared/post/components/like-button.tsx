"use client"

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { toast } from "sonner"

import type { LikeInfo } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  postId: string
  initialState: LikeInfo
}

export function LikeButton({ postId, initialState }: LikeButtonProps) {
  const queryClient = useQueryClient()

  const queryKey: QueryKey = ["like-info", postId]

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  })

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey)

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likesCount:
          (previousState?.likesCount || 0) +
          (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }))

      return { previousState }
    },

    onError(error, variables, context) {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState)
      }
      console.error("Like/UnLike request failed:", error)
      toast.error("Something went wrong. Please try again.")
    },
  })

  return (
    <button
      onClick={() => mutate()}
      className="group flex cursor-pointer items-center gap-2"
      type="button"
    >
      <Heart
        className={cn(
          "size-5 transition-all duration-300",
          data.isLikedByUser
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground group-hover:text-red-400",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likesCount} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  )
}
