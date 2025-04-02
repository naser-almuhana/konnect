import Link from "next/link"

import { MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function MessagesButton() {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <MailIcon />
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 rounded-full px-1 text-xs font-medium tabular-nums">
            4
          </span>
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  )
}
