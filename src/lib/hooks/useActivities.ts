import { useState, useEffect, useCallback } from "react"

interface ActivityPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Activity {
  id: string
  activityType: string
  title: string
  description: string
  amount?: number
  packageType?: string
  seen: boolean
  userId: string
  transactionId?: string
  createdAt: string
  transaction?: {
    amount: number
    packageType?: string
    status: string
    transactionType: string
  }
}

interface ActivityResponse {
  activities: Activity[]
  unseenCount: number
  pagination: ActivityPagination
}

interface ActivityFilters {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  type?: string
  seen?: boolean
  startDate?: string
  endDate?: string
  search?: string
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [unseenCount, setUnseenCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ActivityPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  const fetchActivities = useCallback(async (filters: ActivityFilters = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query params from filters
      const queryParams = new URLSearchParams()
      if (filters.page) queryParams.append("page", filters.page.toString())
      if (filters.limit) queryParams.append("limit", filters.limit.toString())
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy)
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder)
      if (filters.type) queryParams.append("type", filters.type)
      if (filters.seen !== undefined)
        queryParams.append("seen", filters.seen.toString())
      if (filters.startDate) queryParams.append("startDate", filters.startDate)
      if (filters.endDate) queryParams.append("endDate", filters.endDate)
      if (filters.search) queryParams.append("search", filters.search)

      const response = await fetch(`/api/activities?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error(`Error fetching activities: ${response.statusText}`)
      }

      const data: ActivityResponse = await response.json()
      setActivities(data.activities)
      setUnseenCount(data.unseenCount)
      setPagination(data.pagination)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch activities"
      )
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
    fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    unseenCount,
    isLoading,
    error,
    pagination,
    fetchActivities,
    markAsSeen,
    markAllAsSeen,
  }
}
