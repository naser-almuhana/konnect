"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"

import { CommentsPage, PostData } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"

import { Button } from "@/components/ui/button"

import { CommentInput } from "./components/comment-input"
import { SingleComment } from "./components/single-comment"

interface CommentListProps {
  post: PostData
}

export function CommentList({ post }: CommentListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/${post.id}/comments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<CommentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  })

  const comments = data?.pages.flatMap((page) => page.comments) || []

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {isFetchingNextPage && <Loader2Icon className="mx-auto animate-spin" />}
      {status === "pending" && <Loader2Icon className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-muted-foreground text-center">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-destructive text-center">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <SingleComment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
