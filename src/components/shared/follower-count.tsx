"use client"

import type { FollowerInfo } from "@/types/db.types"

import { formatNumber } from "@/lib/utils"

import { useFollowerInfo } from "@/hooks/use-follower-info"

interface FollowerCountProps {
  userId: string
  initialState: FollowerInfo
}

export function FollowerCount({ userId, initialState }: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState)
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">
        {formatNumber(data?.followersCount)}
      </span>
    </span>
  )
}
