import { useState, useEffect, useCallback } from "react"
import { Activity } from "./useActivities"

interface RecentActivitiesResponse {
  activities: Activity[]
  unseenCount: number
}

export function useRecentActivities(limit: number = 5) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [unseenCount, setUnseenCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentActivities = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/activities/recent?limit=${limit}`)

      if (!response.ok) {
        throw new Error(
          `Error fetching recent activities: ${response.statusText}`
        )
      }

      const data: RecentActivitiesResponse = await response.json()
      setActivities(data.activities)
      setUnseenCount(data.unseenCount)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch recent activities"
      )
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  const markAsSeen = useCallback(async (activityIds: string[]) => {
    try {
      const response = await fetch("/api/activities/seen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activityIds }),
      })

      if (!response.ok) {
        throw new Error(
          `Error marking activities as seen: ${response.statusText}`
        )
      }

      // Update local state to reflect seen status
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activityIds.includes(activity.id)
            ? { ...activity, seen: true }
            : activity
        )
      )

      // Update unseen count
      setUnseenCount((prev) => Math.max(0, prev - activityIds.length))

      return await response.json()
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const markAllAsSeen = useCallback(async () => {
    try {
      const response = await fetch("/api/activities/seen", {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error(
          `Error marking all activities as seen: ${response.statusText}`
        )
      }

      // Update local state to reflect seen status
      setActivities((prevActivities) =>
        prevActivities.map((activity) => ({ ...activity, seen: true }))
      )

      // Reset unseen count
      setUnseenCount(0)

      return await response.json()
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchRecentActivities()

    // Set up interval to periodically check for new notifications
    const intervalId = setInterval(() => {
      fetchRecentActivities()
    }, 60000) // Check every minute

    return () => clearInterval(intervalId)
  }, [fetchRecentActivities])

  return {
    activities,
    unseenCount,
    isLoading,
    error,
    fetchRecentActivities,
    markAsSeen,
    markAllAsSeen,
  }
}
