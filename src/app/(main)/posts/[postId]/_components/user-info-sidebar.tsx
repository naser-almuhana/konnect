import Link from "next/link"

import { UserData } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"

import { FollowButton } from "@/components/shared/follow-button"
import { Linkify } from "@/components/shared/linkify"
import { UserAvatar } from "@/components/shared/user-avatar"
import { UserTooltip } from "@/components/shared/user-tooltip"

interface UserInfoSidebarProps {
  user: UserData
}

export async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest()
  if (!loggedInUser) return null

  return (
    <div className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar src={user.image} className="flex-none" />
          <div>
            <p className="line-clamp-1 font-semibold break-all hover:underline">
              {user.displayUsername}
            </p>
            <p className="text-muted-foreground line-clamp-1 break-all">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="text-muted-foreground line-clamp-6 break-words whitespace-pre-line">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followersCount: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  )
}
