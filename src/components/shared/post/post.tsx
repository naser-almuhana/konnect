"use client"

import Link from "next/link"
import { useState } from "react"

import type { PostData } from "@/types/db.types"

import { useSession } from "@/lib/auth-client"
import { formatRelativeDate } from "@/lib/utils"

import { Linkify } from "@/components/shared/linkify"
import { UserAvatar } from "@/components/shared/user-avatar"
import { UserTooltip } from "@/components/shared/user-tooltip"
import { Separator } from "@/components/ui/separator"

import { BookmarkButton } from "./components/bookmark-button"
import { CommentButton } from "./components/comment-button"
import { CommentList } from "./components/comment-list"
import { LikeButton } from "./components/like-button"
import { MediaPreviewList } from "./components/media-preview-list"
import { PostMoreMenu } from "./components/post-more-menu"

interface PostProps {
  post: PostData
}

export function Post({ post }: PostProps) {
  const { data } = useSession()

  const [showComments, setShowComments] = useState(false)

  return (
    <article className="group/post bg-card space-y-3 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar src={post.user.image} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayUsername}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="text-muted-foreground block text-sm hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === data?.user.id && (
          <PostMoreMenu
            postId={post.id}
            triggerClassName="opacity-100 md:opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="break-words whitespace-pre-line">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviewList attachments={post.attachments} />
      )}

      <Separator />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likesCount: post._count.likes,
              isLikedByUser: post.likes.some(
                (like) => like.userId === data?.user.id,
              ),
            }}
          />

          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === data?.user.id,
            ),
          }}
        />
      </div>
      {showComments && <CommentList post={post} />}
    </article>
  )
}
