"use client"

import { useInfiniteQuery } from "@tanstack/react-query"

import type { PostsPage } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"

import { InfiniteScrollContainer } from "@/components/shared/infinite-scroll-container"
import { Post } from "@/components/shared/post"
import { PostsSkeleton } from "@/components/shared/skeletons/posts-skeleton"

interface UserPostsProps {
  userId: string
}

export function UserPosts({ userId }: UserPostsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (status === "pending") {
    return <PostsSkeleton />
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-muted-foreground text-center">
        This user hasn&apos;t posted anything yet.
      </p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-destructive text-center">
        An error occurred while loading posts.
      </p>
    )
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <PostsSkeleton count={3} />}
    </InfiniteScrollContainer>
  )
}

//  if you want a load more button instead of infinite scroll
// <div className="space-y-5">
//   {posts.map((post) => (
//     <Post key={post.id} post={post} />
//   ))}
//   {isFetchingNextPage && <PostsSkeleton />}
//   <Button onClick={() => fetchNextPage()}>LoadMore</Button>
// </div>
