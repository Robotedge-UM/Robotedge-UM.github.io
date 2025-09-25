"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface WalletInfo {
  companyWallet: number
  registerWallet: number
  bonusWallet: number
  totalBalance: number
  isQualified: boolean
}

export function useWalletInfo() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pathname = usePathname()

  const fetchWalletInfo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/user/wallet-info")

      if (!response.ok) {
        throw new Error("Failed to fetch wallet information")
      }

      const data = await response.json()
      setWalletInfo(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setWalletInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletInfo()
  }, [pathname])

  return {
    walletInfo,
    isLoading,
    error,
    refresh: fetchWalletInfo,
  }
}
