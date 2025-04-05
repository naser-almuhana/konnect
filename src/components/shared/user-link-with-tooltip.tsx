"use client"

import Link from "next/link"
import { PropsWithChildren } from "react"

import { useQuery } from "@tanstack/react-query"
import { HTTPError } from "ky"

import { UserData } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"

import { UserTooltip } from "./user-tooltip"

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string
}

export function UserLinkWithTooltip({
  username,
  children,
}: UserLinkWithTooltipProps) {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: async () =>
      kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false
      }
      return failureCount < 3
    },
    staleTime: Infinity,
  })

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    )
  }

  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  )
}
