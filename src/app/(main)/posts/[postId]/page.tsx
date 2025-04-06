import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PostIdParams } from "@/types"

import { getPost } from "@/lib/actions/post.actions"
import { validateRequest } from "@/lib/auth"

import { Post } from "@/components/shared/post"

import { UserInfoSidebar } from "./_components/user-info-sidebar"

export async function generateMetadata({
  params,
}: PostIdParams): Promise<Metadata> {
  const { postId } = await params
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) return {}

  const post = await getPost(postId, loggedInUser.id)

  return {
    title: `${post.user.displayUsername}: ${post.content.slice(0, 50)}...`,
  }
}

export default async function PostDetailsPage({ params }: PostIdParams) {
  const { user: loggedInUser } = await validateRequest()
  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    )
  }

  const { postId } = await params
  if (!postId) notFound()

  const post = await getPost(postId, loggedInUser.id)

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <UserInfoSidebar user={post.user} />
      </div>
    </main>
  )
}
