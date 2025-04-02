import Link from "next/link"

import type { PostData } from "@/types/db.types"

import { useSession } from "@/lib/auth-client"
import { formatRelativeDate } from "@/lib/utils"

import { UserAvatar } from "@/components/shared/user-avatar"

import { PostMoreMenu } from "./components/post-more-menu"

interface PostProps {
  post: PostData
}

export function Post({ post }: PostProps) {
  const { data } = useSession()
  return (
    <article className="group/post bg-card h-40 space-y-3 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user.username}`}>
            <UserAvatar src={post.user.image || ""} />
          </Link>
          <div>
            <Link
              href={`/users/${post.user.username}`}
              className="block font-medium hover:underline"
            >
              {post.user.displayUsername}
            </Link>

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
      {post.content}
    </article>
  )
}
