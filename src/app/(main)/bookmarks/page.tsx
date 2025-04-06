import type { Metadata } from "next"

import { TrendsSidebar } from "@/components/shared/trends-sidebar"

import { BookmarkList } from "./_components/bookmark-list"

export const metadata: Metadata = {
  title: "Bookmarks",
}

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarkList />
      </div>
      <TrendsSidebar />
    </main>
  )
}
