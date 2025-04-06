import { Skeleton } from "@/components/ui/skeleton"

export function UserInfoSidebarSkeleton() {
  return (
    <div className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
      <Skeleton className="h-16 rounded" />
      <Skeleton className="h-8 w-32 rounded" />
    </div>
  )
}
