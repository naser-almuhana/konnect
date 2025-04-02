import Link from "next/link"

import { BookmarkIcon, HomeIcon } from "lucide-react"

import { validateRequest } from "@/lib/auth"

import { Button } from "@/components/ui/button"

import { MessagesButton } from "./messages-button"
import { NotificationsButton } from "./notifications-button"

export async function MenuBar({ className }: React.ComponentProps<"div">) {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <HomeIcon />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton />
      {/* <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      /> */}
      <MessagesButton />
      {/* <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} /> */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <BookmarkIcon />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  )
}
