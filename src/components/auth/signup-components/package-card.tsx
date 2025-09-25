import { motion } from "framer-motion"
import { Check, Lock } from "lucide-react"
import { Package } from "@/types/package"

interface PackageCardProps {
  isSelected: boolean
  isAvailable: boolean
  unavailableReason: string
  packageDetails: Package
  onSelect: () => void
}

const PackageCard = ({
  isSelected,
  isAvailable,
  unavailableReason,
  packageDetails,
  onSelect,
}: PackageCardProps) => {
  // Helper to format package name for display
  const getFormattedName = (pkgType: string): string => {
    const pkgTypeString = String(pkgType)
    return (
      pkgTypeString.charAt(0).toUpperCase() +
      pkgTypeString.slice(1).toLowerCase()
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isAvailable ? 1 : 0.9,
        scale: 1,
        filter: isAvailable ? "none" : "grayscale(0.8)",
      }}
      whileHover={isAvailable ? { scale: 1.03, y: -5 } : { filter: "none" }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden border rounded-xl shadow-lg
        ${
          isSelected
            ? "border-primary/50 bg-primary/5 ring-2 ring-primary/30"
            : "border-white/20 bg-white/5"
        }
        ${
          !isAvailable
            ? "cursor-not-allowed"
            : "cursor-pointer hover:shadow-xl transition-all duration-300"
        }`}
      onClick={onSelect}
    >
      {/* Glassmorphic effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></span>

      <div className="relative p-4">
        <div className="flex items-start justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-bold text-foreground">
                {getFormattedName(packageDetails.packageType.name)}
              </h3>
              {isSelected && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
                  <Check className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>

            <p className="mt-1 text-2xl font-bold text-primary">
              ${packageDetails.price}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Max Milestone:{" "}
              {packageDetails.packageType.name === "KING"
                ? "Unlimited"
                : `$${packageDetails.maxMilestone}`}
            </p>

            {!isAvailable && (
              <div className="flex items-center mt-2 text-xs text-amber-500">
                <Lock className="w-3 h-3 mr-1" />
                <span>{unavailableReason}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PackageCard
