import { useEffect, useState } from "react"
import { useAuth } from "./useAuth"

interface PackageProgress {
  packageTypeName: string | null
  totalEarnings: number
  maxMilestone: number | null
  progressPercentage: number
  nextPackageName: string | null
}

export function usePackageProgress() {
  const { isImpersonating } = useAuth()
  const [progress, setProgress] = useState<PackageProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackageProgress = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/dashboard/package-progress")
        if (!response.ok) {
          throw new Error("Failed to fetch package progress")
        }
        const data = await response.json()
        setProgress(data.packageProgress)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("Error fetching package progress:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackageProgress()
  }, [isImpersonating])

  return { progress, isLoading, error }
}
