import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { BookmarkIcon } from "lucide-react"
import { toast } from "sonner"

import { BookmarkInfo } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"
import { cn } from "@/lib/utils"

interface BookmarkButtonProps {
  postId: string
  initialState: BookmarkInfo
}

export function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  const queryClient = useQueryClient()

  const queryKey: QueryKey = ["bookmark-info", postId]

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  })

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),

    onMutate: async () => {
      toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`)

      await queryClient.cancelQueries({ queryKey })

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey)

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }))
      return { previousState }
    },

    onError(error, variables, context) {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState)
      }
      console.error("bookmark request failed:", error)
      toast.error("Something went wrong. Please try again.")
    },
  })
  return (
    <button
      onClick={() => mutate()}
      className="group flex cursor-pointer items-center gap-2 transition"
    >
      <BookmarkIcon
        className={cn(
          "size-5 transition-all duration-300",
          data.isBookmarkedByUser
            ? "fill-yellow-500 text-yellow-500"
            : "text-muted-foreground group-hover:text-yellow-400",
        )}
      />
    </button>
  )
}
