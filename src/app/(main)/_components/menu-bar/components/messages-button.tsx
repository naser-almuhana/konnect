import Link from "next/link"

import { MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function MessagesButton() {
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-2 px-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <MailIcon className="size-5" />
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  )
}
