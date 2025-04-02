import Link from "next/link"

import { BellIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NotificationsButton() {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-2"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <BellIcon />
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  )
}
