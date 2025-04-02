import { Suspense } from "react"

import { TrendingTopics } from "./components/trending-topics"
import { TrendingTopicsSkeleton } from "./components/trending-topics-skeleton"
import { WhoToFollow } from "./components/who-to-follow"
import { WhoToFollowSkeleton } from "./components/who-to-follow-skeleton"

export function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense
        fallback={
          <>
            <WhoToFollowSkeleton />
            <TrendingTopicsSkeleton />
          </>
        }
      >
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  )
}
