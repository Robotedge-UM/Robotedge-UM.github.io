"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRight, Check, X, CreditCard, Wallet } from "lucide-react"
import { useState } from "react"
import { Package } from "@/types/package"

interface PaymentSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPackage: Package | null
  referrerInfo: {
    firstName: string
    packageType: string
    packageName: string
  } | null
  onConfirm: (paymentGateway: string) => Promise<void>
  processing: boolean
}

export function PaymentSelectionModal({
  isOpen,
  onClose,
  selectedPackage,
  referrerInfo,
  onConfirm,
  processing,
}: PaymentSelectionModalProps) {
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState("dummy")

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

  const handleConfirm = async () => {
    if (!selectedPackage) return

    try {
      await onConfirm(selectedPaymentGateway)
    } catch (error) {
      // Error is handled in the parent component
    }
  }

  if (!isOpen || !selectedPackage) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={processing}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-800">
            Complete Registration
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Pay ${selectedPackage.price} USDT to join as{" "}
            {selectedPackage.packageType.name}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Referrer Information */}
            {referrerInfo && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">
                    Referrer
                  </span>
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
              </div>
            )}

            {/* Package Details */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Selected Package</span>
                <span className="font-medium text-gray-800">
                  {selectedPackage.packageType.name}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Price</span>
                <span className="font-medium text-gray-800">
                  ${selectedPackage.price} USDT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Point Value</span>
                <span className="font-medium text-gray-800">
                  {selectedPackage.pointValue} PV
                </span>
              </div>
            </div>

            {/* Payment Gateway Selection */}
            <div className="space-y-3">
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
                      disabled={gateway.disabled || processing}
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
            </div>

            {/* Package Benefits */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 block">
                Package Benefits
              </label>
              <div className="relative px-5 py-3 overflow-hidden border shadow-md bg-gradient-to-br from-gray-50 to-white border-gray-200 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">
                      Earn commissions up to $
                      {selectedPackage.maxMilestone === 999999
                        ? "unlimited"
                        : selectedPackage.maxMilestone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-700">
                      {selectedPackage.pointValue} PV for binary placement
                      bonuses
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-gray-700">
                      {selectedPackage.activeDays} days package validity
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="text-xs bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700">
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
                  Your account will be created and you'll be automatically
                  placed in the binary tree with optimal placement.
                  {referrerInfo &&
                    ` Your referrer ${referrerInfo.firstName} will receive introducer bonuses.`}
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                variant="gradient"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                isLoading={processing}
                disabled={processing}
                onClick={handleConfirm}
              >
                {processing
                  ? "Creating Account..."
                  : selectedPaymentGateway === "dummy"
                    ? `Join as ${selectedPackage.packageType.name} Member`
                    : `Pay with ${paymentGateways.find((g) => g.id === selectedPaymentGateway)?.name}`}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-3">
                Account creation is processed immediately and cannot be
                reversed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
