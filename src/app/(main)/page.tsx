import { TrendsSidebar } from "@/components/shared/trends-sidebar"

import { PostEditor } from "./_components/post-editor"
import { PostsList } from "./_components/posts-list"

export default function HomePage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <PostsList />
      </div>
      <TrendsSidebar />
    </main>
  )
}
