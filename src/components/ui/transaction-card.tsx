import { TransactionType, TxStatus, WalletType } from "@prisma/client"
import { motion } from "framer-motion"
import { CreditCard, RefreshCw, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransactionCardProps {
  transaction: {
    id: string
    amount: number
    package: {
      name: string
      packageType: {
        name: string
      }
    } | null
    isUpgrade: boolean
    status: TxStatus
    transactionType: TransactionType
    walletType: WalletType | null
    createdAt: string
    user: {
      username: string
      firstName: string | null
      lastName: string | null
      email: string
    }
    fromUser: {
      username: string
      firstName: string | null
      lastName: string | null
      email: string
    } | null
  }
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const getStatusColor = (status: TxStatus) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      case "PENDING":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "FAILED":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      default:
        return "text-muted-foreground bg-white/5 border-white/10"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "REGISTRATION":
        return CreditCard
      case "UPGRADE":
        return RefreshCw
      case "COMMISSION":
        return Wallet
      case "WALLET_TRANSFER":
        return RefreshCw
      default:
        return Wallet
    }
  }

  const getTransactionTypeDisplay = (type: TransactionType) => {
    switch (type) {
      case "REGISTRATION":
        return "Registration"
      case "UPGRADE":
        return "Upgrade"
      case "COMMISSION":
        return "Commission"
      case "WALLET_TRANSFER":
        return "Wallet Transfer"
      default:
        return "Transaction"
    }
  }

  const getWalletTypeDisplay = (type: WalletType | null) => {
    if (!type) return null
    switch (type) {
      case "COMPANY":
        return "Company Wallet"
      case "REGISTER":
        return "Register Wallet"
      case "BONUS":
        return "Bonus Wallet"
      default:
        return `${type} Wallet`
    }
  }

  const getWalletTypeColor = (type: WalletType | null) => {
    if (!type) return "text-muted-foreground"
    switch (type) {
      case "COMPANY":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20"
      case "REGISTER":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      case "BONUS":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20"
      default:
        return "text-muted-foreground bg-white/5 border-white/10"
    }
  }

  const Icon = getTransactionIcon(transaction.transactionType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-4 rounded-lg border border-white/10"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium">
              {getTransactionTypeDisplay(transaction.transactionType)}
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDate(transaction.createdAt)}
            </div>
          </div>
          <div className="mt-1 text-sm text-muted-foreground truncate font-mono">
            {transaction.id.slice(0, 16)}...
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="text-lg font-semibold">${transaction.amount}</div>
            <div
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border",
                getStatusColor(transaction.status)
              )}
            >
              {transaction.status}
            </div>
          </div>
          {transaction.package && (
            <div className="mt-2 text-sm text-muted-foreground">
              Package: {transaction.package.name}
            </div>
          )}
          {getWalletTypeDisplay(transaction.walletType) && (
            <div className="mt-1">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium border",
                  getWalletTypeColor(transaction.walletType)
                )}
              >
                {getWalletTypeDisplay(transaction.walletType)}
              </span>
            </div>
          )}
          {transaction.fromUser && (
            <div className="mt-1 text-sm text-muted-foreground">
              From: @{transaction.fromUser.username}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
