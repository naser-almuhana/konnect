import type { Metadata } from "next"

import { TrendsSidebar } from "@/components/shared/trends-sidebar"

import { Notifications } from "./_components/notifications"

export const metadata: Metadata = {
  title: "Notifications",
}

export default function NotificationsPage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Notifications</h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  )
}
