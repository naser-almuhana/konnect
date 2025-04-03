import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { FollowingFeed } from "./components/following-feed"
import { ForYouFeed } from "./components/for-you-feed"

export function PostsList() {
  return (
    <Tabs defaultValue="for-you">
      <TabsList>
        <TabsTrigger value="for-you">For you</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>
      <TabsContent value="for-you">
        <ForYouFeed />
      </TabsContent>
      <TabsContent value="following">
        <FollowingFeed />
      </TabsContent>
    </Tabs>
  )
}
