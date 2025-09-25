import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Package } from "@/types/package"

// Components
import PackageCard from "../signup-components/package-card"

interface PackageSelectionFormProps {
  selectedPackage: string | null
  setSelectedPackage: (packageId: string | null) => void
  referrerInfo: {
    firstName: string
    packageType: string
    packageName: string
  } | null
}

const PackageSelectionForm = ({
  selectedPackage,
  setSelectedPackage,
  referrerInfo,
}: PackageSelectionFormProps) => {
  // State to store packages fetched from API
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoadingPackages, setIsLoadingPackages] = useState(false)
  const [packageError, setPackageError] = useState<string | null>(null)

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoadingPackages(true)
      setPackageError(null)

      try {
        const response = await fetch("/api/packages")

        if (!response.ok) {
          throw new Error("Failed to fetch packages")
        }

        const data = await response.json()
        setPackages(data.packages)
      } catch (error) {
        console.error("Error fetching packages:", error)
        setPackageError("Failed to load packages. Please try again later.")
      } finally {
        setIsLoadingPackages(false)
      }
    }

    fetchPackages()
  }, [])

  // Check if a package is available based on referrer's package
  const isPackageAvailable = (packageType: string): boolean => {
    // If no referrer info, all packages are available
    if (!referrerInfo) return true

    // Find the referrer's package
    const referrerPackage = packages.find(
      (p) => p.packageType.name === referrerInfo.packageType
    )

    // If referrer package not found in our list, default to allowing only Duke
    if (!referrerPackage) {
      return packageType === "DUKE"
    }

    // Simplified logic: anyone can register with any package now
    // TODO: Implement package hierarchy rules if needed
    return true
  }

  // Get package availability reason
  const getPackageAvailabilityReason = (packageType: string): string => {
    if (isPackageAvailable(packageType)) {
      return ""
    }

    if (referrerInfo) {
      const packageName =
        packages.find((p) => p.packageType.name === referrerInfo.packageType)
          ?.packageType.name || referrerInfo.packageType
      return `Only available when referred by a compatible package holder. Your upline (${referrerInfo.firstName}) has ${packageName} package.`
    }

    return "This package is not available based on your referrer's package"
  }

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 text-center"
      >
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Choose Your Package
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a package to join our MLM program
        </p>
      </motion.div>

      {/* Package Loading State */}
      {isLoadingPackages && (
        <div className="flex justify-center py-6">
          <div className="animate-pulse text-center">
            <div className="h-4 bg-gray-300 rounded w-48 mb-2 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Package Error State */}
      {packageError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="relative p-3 mb-4 overflow-hidden border rounded-lg bg-destructive/10 backdrop-blur-md border-destructive/20"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-destructive">Error</p>
              <p className="mt-1 text-xs text-destructive/80">{packageError}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Package Selection Cards */}
      {packages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              isSelected={selectedPackage === pkg.id}
              isAvailable={isPackageAvailable(pkg.packageType.name)}
              unavailableReason={getPackageAvailabilityReason(
                pkg.packageType.name
              )}
              packageDetails={pkg}
              onSelect={() => {
                if (isPackageAvailable(pkg.packageType.name)) {
                  setSelectedPackage(pkg.id)
                }
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default PackageSelectionForm
