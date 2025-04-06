"use client"

import { useQuery } from "@tanstack/react-query"

import { LikeInfo } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"

/**
 * Custom React Query hook to fetch like information for a post.
 *
 * @param {string} postId - The ID of the post whose like info is being fetched.
 * @param {LikeInfo} initialState - The initial state to populate the query before fetching.
 *
 */
export function useLikeInfo(postId: string, initialState: LikeInfo) {
  const query = useQuery({
    queryKey: ["like-info", postId],
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  })

  return query
}
