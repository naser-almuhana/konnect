"use client"

import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { FollowerInfo } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"

/**
 * Custom React Query hook to fetch follower information for a user.
 *
 * @param {string} userId - The ID of the user whose follower info is being fetched.
 * @param {FollowerInfo} initialState - The initial state to populate the query before fetching.
 *
 * @returns {UseQueryResult<FollowerInfo>} Query result containing the follower data, loading state, and error state.
 */
export function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
): UseQueryResult<FollowerInfo> {
  const query = useQuery({
    queryKey: ["follower-info", userId], // Unique key for caching and refetching
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(), // API request to fetch followers
    initialData: initialState, // Set the initial cached data before the request resolves
    //  The fetched follower data will never be considered stale,
    //  meaning React Query won't automatically refetch it in the background
    //  when the component re-renders or the user navigates back to the page.
    staleTime: Infinity,
  })

  return query
}
