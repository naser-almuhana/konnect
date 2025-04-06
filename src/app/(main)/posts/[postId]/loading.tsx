import { SinglePostSkeleton } from "@/components/shared/skeletons/single-post-skeleton"
import { UserInfoSidebarSkeleton } from "@/components/shared/skeletons/user-info-sidebar-skeleton"

export default function PageDetailsLoading() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <SinglePostSkeleton />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <UserInfoSidebarSkeleton />
      </div>
    </main>
  )
}
