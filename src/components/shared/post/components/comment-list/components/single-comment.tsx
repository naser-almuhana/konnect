"use client"

import Link from "next/link"

import { CommentData } from "@/types/db.types"

import { useSession } from "@/lib/auth-client"
import { formatRelativeDate } from "@/lib/utils"

import { Linkify } from "@/components/shared/linkify"
import { UserAvatar } from "@/components/shared/user-avatar"
import { UserTooltip } from "@/components/shared/user-tooltip"

import { CommentMoreMenu } from "./comment-more-menu"

interface SingleCommentProps {
  comment: CommentData
}

export function SingleComment({ comment }: SingleCommentProps) {
  const { data } = useSession()
  return (
    <div className="group/comment flex gap-3 overflow-y-hidden py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar src={comment.user.image} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayUsername}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {" "}
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div className="max-w-full overflow-hidden break-words whitespace-pre-wrap sm:max-w-2xl">
          <Linkify>{comment.content}</Linkify>
        </div>
      </div>
      {comment.user.id === data?.user.id && (
        <CommentMoreMenu
          comment={comment}
          triggerClassName="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  )
}
