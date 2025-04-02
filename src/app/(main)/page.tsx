import { PostEditor } from "@/components/posts/editor/post-editor"
import { TrendsSidebar } from "@/components/shared/trends-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ForYouFeed } from "./_components/for-you-feed"

export default function HomePage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">Follow</TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  )
}
