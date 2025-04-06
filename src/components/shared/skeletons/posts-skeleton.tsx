import { PER_PAGE } from "@/constants"

import { SinglePostSkeleton } from "@/components/shared/skeletons/single-post-skeleton"

export function PostsSkeleton({ count = PER_PAGE }: { count?: number }) {
  return (
    <div className="space-y-5">
      {[...Array(count)].map((_, index) => (
        <SinglePostSkeleton key={index} />
      ))}
    </div>
  )
}
