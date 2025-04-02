import Link from "next/link"

import { getUserDataSelect } from "@/types/db.types"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

import { Button } from "@/components/ui/button"

import { UserAvatar } from "../../user-avatar"

export async function WhoToFollow() {
  const { user } = await validateRequest()
  if (!user) return null

  const usersToFollow = await db.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  })

  if (usersToFollow.length === 0) return null

  return (
    <div className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar src={user.image || ""} className="flex-none" />
            <div>
              <p className="line-clamp-1 font-semibold break-all hover:underline">
                {user.displayUsername}
              </p>
              <p className="text-muted-foreground line-clamp-1 break-all">
                @{user.username}
              </p>
            </div>
          </Link>

          <Button>Follow</Button>

          {/* <FollowButton 
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          /> */}
        </div>
      ))}
    </div>
  )
}
