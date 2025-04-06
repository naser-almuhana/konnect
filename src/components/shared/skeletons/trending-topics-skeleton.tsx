import { Skeleton } from "@/components/ui/skeleton"

export function TrendingTopicsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}
