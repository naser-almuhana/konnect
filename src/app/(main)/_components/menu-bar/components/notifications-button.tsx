"use client"

import Link from "next/link"

import { useQuery } from "@tanstack/react-query"
import { BellIcon } from "lucide-react"

import { NotificationCountInfo } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"

import { Button } from "@/components/ui/button"

interface NotificationsButtonProps {
  initialState: NotificationCountInfo
}

export function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000, // 1min
  })

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-2 px-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <span className="relative">
          <BellIcon className="size-5" />
          {!!data.unreadCount && (
            <span
              className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[0.625rem] font-medium tabular-nums"
              aria-label={`Notifications (${data.unreadCount} unread)`}
            >
              {data.unreadCount > 9 ? "9+" : data.unreadCount}
            </span>
          )}
        </span>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  )
}
