import { Suspense } from "react"

import { TrendingTopicsSkeleton } from "@/components/shared/skeletons/trending-topics-skeleton"
import { WhoToFollowSkeleton } from "@/components/shared/skeletons/who-to-follow-skeleton"

import { TrendingTopics } from "./components/trending-topics"
import { WhoToFollow } from "./components/who-to-follow"

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
