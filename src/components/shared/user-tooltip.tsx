"use client"

import Link from "next/link"
import { PropsWithChildren } from "react"

import { FollowerInfo, type UserData } from "@/types/db.types"

import { useSession } from "@/lib/auth-client"

import { FollowButton } from "@/components/shared/follow-button"
import { FollowerCount } from "@/components/shared/follower-count"
import { Linkify } from "@/components/shared/linkify"
import { UserAvatar } from "@/components/shared/user-avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserTooltipProps extends PropsWithChildren {
  user: UserData
}

export function UserTooltip({ user, children }: UserTooltipProps) {
  const { data } = useSession()

  const followerState: FollowerInfo = {
    followersCount: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === data?.user.id,
    ),
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 px-1 py-2.5 break-words md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar
                  src={user.image}
                  className="size-full max-h-24 max-w-24"
                />
              </Link>
              {data?.user.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayUsername}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount userId={user.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
