import type { Metadata } from "next"

import type { UsernameParams } from "@/types"

import { getUser } from "@/lib/actions/user.actions"
import { validateRequest } from "@/lib/auth"

import { TrendsSidebar } from "@/components/shared/trends-sidebar"

import { UserPosts } from "./_components/user-posts"
import { UserProfile } from "./_components/user-profile"

export async function generateMetadata({
  params,
}: UsernameParams): Promise<Metadata> {
  const { username } = await params
  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) return {}

  const user = await getUser(username, loggedInUser.id)

  return {
    title: `${user.displayUsername} (@${user.username})`,
  }
}

export default async function UserDetailsPage({ params }: UsernameParams) {
  const { username } = await params

  const { user: loggedInUser } = await validateRequest()

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    )
  }

  const user = await getUser(username, loggedInUser.id)
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayUsername}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  )
}
