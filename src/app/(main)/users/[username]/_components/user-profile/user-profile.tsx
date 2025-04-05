import { formatDate } from "date-fns"

import { FollowerInfo, UserData } from "@/types/db.types"

import { formatNumber } from "@/lib/utils"

import { FollowButton } from "@/components/shared/follow-button"
import { FollowerCount } from "@/components/shared/follower-count"
import { Linkify } from "@/components/shared/linkify"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Separator } from "@/components/ui/separator"

import { EditProfileButton } from "./components/edit-profile-button"

interface UserProfileProps {
  user: UserData
  loggedInUserId: string
}

export function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followersCount: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  }

  return (
    <div className="bg-card h-fit w-full space-y-5 rounded-2xl p-5 shadow-sm">
      <UserAvatar
        src={user.image}
        className="mx-auto size-full max-h-50 max-w-50"
        size={200}
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayUsername}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <Separator />
          <Linkify>
            <div className="overflow-hidden break-words whitespace-pre-line">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  )
}
