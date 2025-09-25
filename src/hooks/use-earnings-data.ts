import { EarningsData } from "@/types/earnings"
import { useEffect, useState } from "react"

export function useEarningsData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
  const [period, setPeriod] = useState("all")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Sorting state
  const [sortField, setSortField] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  // Filtering state
  const [fromUsername, setFromUsername] = useState("")
  const [minAmount, setMinAmount] = useState<string>("")
  const [maxAmount, setMaxAmount] = useState<string>("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    async function fetchEarningsData() {
      try {
        setLoading(true)
        // Build query parameters for API call
        const queryParams = new URLSearchParams({
          period: period,
          page: currentPage.toString(),
          limit: pageSize.toString(),
          sortField: sortField,
          sortOrder: sortOrder,
        })

        // Add optional filters if they exist
        if (fromUsername) queryParams.append("fromUsername", fromUsername)
        if (minAmount) queryParams.append("minAmount", minAmount)
        if (maxAmount) queryParams.append("maxAmount", maxAmount)
        if (startDate) queryParams.append("startDate", startDate.toISOString())
        if (endDate) queryParams.append("endDate", endDate.toISOString())

        const response = await fetch(
          `/api/dashboard/earnings?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch earnings data")
        }

        setEarningsData(data.earnings)
        setError(null)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchEarningsData()
  }, [
    period,
    currentPage,
    pageSize,
    sortField,
    sortOrder,
    fromUsername,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  ])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [fromUsername, minAmount, maxAmount, startDate, endDate, period])

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
  }

  return {
    loading,
    error,
    period,
    earningsData,
    currentPage,
    pageSize,
    sortField,
    sortOrder,
    fromUsername,
    minAmount,
    maxAmount,
    startDate,
    endDate,
    setCurrentPage,
    setPageSize,
    setSortField,
    setSortOrder,
    setFromUsername,
    setMinAmount,
    setMaxAmount,
    setStartDate,
    setEndDate,
    handlePeriodChange,
  }
}
