"use client"

import { useEffect } from "react"

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import type { NotificationsPage } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"

import { InfiniteScrollContainer } from "@/components/shared/infinite-scroll-container"
import { PostsSkeleton } from "@/components/shared/skeletons/posts-skeleton"

import { SingleNotification } from "./single-notification"

export function Notifications() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => {
      return kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>()
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
  const notifications = data?.pages.flatMap((page) => page.notifications) || []

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      })
    },
    onError(error) {
      console.error("Failed to mark notifications as read", error)
    },
  })
  useEffect(() => {
    mutate()
  }, [mutate])

  if (status === "pending") {
    return <PostsSkeleton />
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-muted-foreground text-center">
        You don&apos;t have any notifications yet.
      </p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-destructive text-center">
        An error occurred while loading notifications.
      </p>
    )
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.map((notification) => (
        <SingleNotification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <PostsSkeleton count={3} />}
    </InfiniteScrollContainer>
  )
}
