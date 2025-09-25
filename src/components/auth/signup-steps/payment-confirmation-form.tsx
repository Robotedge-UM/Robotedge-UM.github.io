import { motion } from "framer-motion"
import { Check, CreditCard, Wallet, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Package } from "@/types/package"
import { cn } from "@/lib/utils"

interface PaymentConfirmationFormProps {
  selectedPackage: string | null
  referrerInfo: {
    firstName: string
    packageType: string
    packageName: string
  } | null
}

const PaymentConfirmationForm = ({
  selectedPackage,
  referrerInfo,
}: PaymentConfirmationFormProps) => {
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState("dummy")
  const [packageDetails, setPackageDetails] = useState<Package | null>(null)
  const [isLoadingPackage, setIsLoadingPackage] = useState(false)
  const [packageError, setPackageError] = useState<string | null>(null)

  const paymentGateways = [
    {
      id: "dummy",
      name: "Dummy Gateway",
      description: "Instant registration for testing",
      icon: Wallet,
    },
    {
      id: "leanx",
      name: "LeanX",
      description: "Secure cryptocurrency payments",
      icon: CreditCard,
      disabled: true, // Enable when ready
    },
  ]

  // Fetch package details when selectedPackage changes
  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (!selectedPackage) return

      setIsLoadingPackage(true)
      setPackageError(null)

      try {
        const response = await fetch("/api/packages")
        if (!response.ok) {
          throw new Error("Failed to fetch package details")
        }

        const data = await response.json()
        const packageData = data.packages.find(
          (pkg: Package) => pkg.id === selectedPackage
        )

        if (packageData) {
          setPackageDetails(packageData)
        } else {
          setPackageError("Package not found")
        }
      } catch (error) {
        console.error("Error fetching package details:", error)
        setPackageError("Failed to load package details")
      } finally {
        setIsLoadingPackage(false)
      }
    }

    fetchPackageDetails()
  }, [selectedPackage])

  if (isLoadingPackage) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-center">
          <div className="h-4 bg-gray-300 rounded w-48 mb-2 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (packageError || !packageDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="relative p-4 mb-4 overflow-hidden border rounded-lg bg-destructive/10 backdrop-blur-md border-destructive/20"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-destructive">Error</p>
            <p className="mt-1 text-xs text-destructive/80">
              {packageError || "Package details not available"}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 text-center"
      >
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Complete Your Registration
        </h3>
        <p className="text-sm text-muted-foreground">
          Review your selection and choose payment method
        </p>
      </motion.div>

      {/* Referrer Information */}
      {referrerInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-4 rounded-lg bg-blue-50 border border-blue-200"
        >
          <div className="flex justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">Referrer</span>
            <span className="font-medium text-blue-800">
              {referrerInfo.firstName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-blue-600">Package</span>
            <span className="font-medium text-blue-800">
              {referrerInfo.packageName}
            </span>
          </div>
        </motion.div>
      )}

      {/* Package Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-4 rounded-lg bg-gray-50 border border-gray-200"
      >
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Selected Package</span>
          <span className="font-medium text-gray-800">
            {packageDetails.packageType.name}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Price</span>
          <span className="font-medium text-gray-800">
            ${packageDetails.price} USDT
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Point Value</span>
          <span className="font-medium text-gray-800">
            {packageDetails.pointValue} PV
          </span>
        </div>
      </motion.div>

      {/* Payment Gateway Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="space-y-3"
      >
        <label className="text-sm font-medium text-gray-700 block">
          Select Payment Method
        </label>
        <div className="grid gap-3">
          {paymentGateways.map((gateway) => {
            const IconComponent = gateway.icon
            return (
              <button
                key={gateway.id}
                type="button"
                disabled={gateway.disabled}
                onClick={() => setSelectedPaymentGateway(gateway.id)}
                className={cn(
                  "relative p-4 border rounded-lg text-left transition-all duration-200",
                  selectedPaymentGateway === gateway.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:bg-gray-50",
                  gateway.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-800">
                        {gateway.name}
                        {gateway.disabled && (
                          <span className="ml-2 text-xs text-gray-500">
                            (Coming Soon)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {gateway.description}
                      </div>
                    </div>
                  </div>
                  {selectedPaymentGateway === gateway.id && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Package Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="space-y-2"
      >
        <label className="text-xs font-medium text-gray-500 block">
          Package Benefits
        </label>
        <div className="relative px-5 py-3 overflow-hidden border shadow-md bg-gradient-to-br from-gray-50 to-white border-gray-200 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">
                Earn commissions up to $
                {packageDetails.maxMilestone === 999999
                  ? "unlimited"
                  : packageDetails.maxMilestone}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">
                {packageDetails.pointValue} PV for binary placement bonuses
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-700">
                {packageDetails.activeDays} days package validity
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="text-xs bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700"
      >
        <p className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            ></circle>
            <line
              x1="12"
              y1="16"
              x2="12"
              y2="12"
            ></line>
            <line
              x1="12"
              y1="8"
              x2="12.01"
              y2="8"
            ></line>
          </svg>
          <span>
            Your account will be created and you'll be automatically placed in
            the binary tree with optimal placement.
            {referrerInfo &&
              ` Your referrer ${referrerInfo.firstName} will receive introducer bonuses.`}
          </span>
        </p>
      </motion.div>
    </div>
  )
}

export default PaymentConfirmationForm
