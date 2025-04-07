"use client"

import { MessageSquareIcon } from "lucide-react"

import { PostData } from "@/types/db.types"

interface CommentButtonProps {
  post: PostData
  onClick: () => void
}

export function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2"
    >
      <MessageSquareIcon className="text-muted-foreground size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  )
}
