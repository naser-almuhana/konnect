import Link from "next/link"

import { BookmarkIcon, HomeIcon } from "lucide-react"

import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"

import { Button } from "@/components/ui/button"

import { NotificationsButton } from "./components/notifications-button"

export async function MenuBar({ className }: React.ComponentProps<"div">) {
  const { user } = await validateRequest()
  if (!user) return null

  const [unreadNotificationsCount] = await Promise.all([
    db.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
  ])

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-2"
        title="Home"
        asChild
      >
        <Link href="/">
          <HomeIcon className="size-5" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-2"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <BookmarkIcon className="size-5" />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  )
}
