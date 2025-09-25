import { useState, useEffect } from "react"
import { Package, PackageType } from "@/types/package"

export interface PackageData {
  id: string
  name: string
  price: number
  pointValue: number
  maxMilestone: number
  activeDays: number
  image?: string
  isActive: boolean
  packageType: PackageType
  isCurrentPackage: boolean
  isEligibleForUpgrade: boolean
  createdAt?: string
  updatedAt?: string
}

interface PackagesResponse {
  currentPackage: string | null
  currentMilestone: number
  maxMilestone: number | null
  packages: PackageData[]
}

export function usePackages() {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [currentPackage, setCurrentPackage] = useState<string | null>(null)
  const [currentMilestone, setCurrentMilestone] = useState(0)
  const [maxMilestone, setMaxMilestone] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/dashboard/packages")
        if (!response.ok) {
          throw new Error("Failed to fetch packages")
        }
        const data: PackagesResponse = await response.json()
        setPackages(data.packages)
        setCurrentPackage(data.currentPackage)
        setCurrentMilestone(data.currentMilestone)
        setMaxMilestone(data.maxMilestone)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("Error fetching packages:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const verifyUpgradePackage = async (
    userId: string,
    targetPackage: string
  ): Promise<{
    success: boolean
    error?: string
  }> => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dashboard/packages/verify-upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          targetPackage,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to verify upgrade package")
      }
      const data = await response.json()
      if (data.success) {
        return { success: true }
      } else {
        throw new Error(data.error || "Failed to verify upgrade package")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Error verifying upgrade package:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle package upgrade through database
  const upgradePackageDb = async (
    targetPackage: string,
    paymentGateway: string = "dummy"
  ) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dashboard/packages/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetPackage,
          paymentGateway,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upgrade package")
      }

      const data = await response.json()

      // Refetch package data after successful upgrade
      const packagesResponse = await fetch("/api/dashboard/packages")
      if (packagesResponse.ok) {
        const updatedData: PackagesResponse = await packagesResponse.json()
        setPackages(updatedData.packages)
        setCurrentPackage(updatedData.currentPackage)
        setCurrentMilestone(updatedData.currentMilestone)
        setMaxMilestone(updatedData.maxMilestone)
      }

      return { success: true, data }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      console.error("Error upgrading package:", err)
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    packages,
    currentPackage,
    currentMilestone,
    maxMilestone,
    isLoading,
    error,
    verifyUpgradePackage,
    upgradePackageDb,
  }
}
