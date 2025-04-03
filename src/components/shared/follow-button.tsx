"use client"

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { FollowerInfo } from "@/types/db.types"

import { kyInstance } from "@/lib/ky"

import { useFollowerInfo } from "@/hooks/use-follower-info"

import { Button } from "@/components/ui/button"

interface FollowButtonProps {
  userId: string
  initialState: FollowerInfo
}

/**
 * A button component that allows users to follow/unfollow another user.
 * Uses optimistic UI updates for a seamless experience.
 */
export function FollowButton({ userId, initialState }: FollowButtonProps) {
  const queryClient = useQueryClient()

  // Fetch current follower state using React Query
  const { data } = useFollowerInfo(userId, initialState)

  // Define query key for caching follower information
  const queryKey = ["follower-info", userId] satisfies QueryKey

  // Mutation function to handle follow/unfollow actions
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`) // Unfollow request
        : kyInstance.post(`/api/users/${userId}/followers`), // Follow request

    // Optimistic UI Update: Modify UI before waiting for API response
    onMutate: async () => {
      // Cancel any ongoing queries related to this user’s follower info
      await queryClient.cancelQueries({ queryKey })

      // Get the current follower state before mutation
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey)

      // Update the local cache with an optimistic response
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followersCount:
          (previousState?.followersCount || 0) +
          (previousState?.isFollowedByUser ? -1 : 1), // Increase or decrease follower count
        isFollowedByUser: !previousState?.isFollowedByUser, // Toggle follow state
      }))

      return { previousState } // Save previous state in case of rollback
    },

    // Handle API errors and rollback optimistic update if necessary
    onError(error, variables, context) {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState) // Restore previous state
      }
      console.error("Follow/Unfollow request failed:", error)
      toast.error("Something went wrong. Please try again.") // Show user-friendly error message
    },
  })

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()} // Trigger mutation on button click
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  )
}
