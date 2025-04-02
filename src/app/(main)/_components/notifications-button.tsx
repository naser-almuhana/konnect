import Link from "next/link"

import { BellIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NotificationsButton() {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <BellIcon />
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 rounded-full px-1 text-xs font-medium tabular-nums">
            5
          </span>
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  )
}
