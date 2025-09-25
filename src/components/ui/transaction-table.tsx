import { cn } from "@/lib/utils"
import { TransactionType, TxStatus, WalletType } from "@prisma/client"
import { ArrowDown, ArrowUp } from "lucide-react"

interface TransactionTableProps {
  transactions: {
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
  }[]
  sortConfig: {
    column: string
    direction: "asc" | "desc"
  }
  onSort: (column: string) => void
}

export function TransactionTable({
  transactions,
  sortConfig,
  onSort,
}: TransactionTableProps) {
  const renderSortIcon = (column: string) => {
    if (sortConfig.column !== column) return null
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    )
  }

  const getStatusColor = (status: TxStatus) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-500"
      case "PENDING":
        return "text-yellow-500"
      case "FAILED":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
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
    if (!type) return "-"
    switch (type) {
      case "COMPANY":
        return "Company"
      case "REGISTER":
        return "Register"
      case "BONUS":
        return "Bonus"
      default:
        return type
    }
  }

  const getWalletTypeColor = (type: WalletType | null) => {
    if (!type) return "text-muted-foreground"
    switch (type) {
      case "COMPANY":
        return "text-blue-500"
      case "REGISTER":
        return "text-green-500"
      case "BONUS":
        return "text-purple-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-white/10">
          <tr>
            <th className="px-4 py-3 text-sm font-medium text-left">
              Transaction ID
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">
              From User
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">User</th>
            <th
              className="px-4 py-3 text-sm font-medium text-left cursor-pointer hover:bg-white/5"
              onClick={() => onSort("transactionType")}
            >
              <div className="flex items-center">
                Type
                {renderSortIcon("transactionType")}
              </div>
            </th>
            <th
              className="px-4 py-3 text-sm font-medium text-left cursor-pointer hover:bg-white/5"
              onClick={() => onSort("walletType")}
            >
              <div className="flex items-center">
                Wallet
                {renderSortIcon("walletType")}
              </div>
            </th>
            <th
              className="px-4 py-3 text-sm font-medium text-left cursor-pointer hover:bg-white/5"
              onClick={() => onSort("amount")}
            >
              <div className="flex items-center">
                Amount
                {renderSortIcon("amount")}
              </div>
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">Package</th>
            <th
              className="px-4 py-3 text-sm font-medium text-left cursor-pointer hover:bg-white/5"
              onClick={() => onSort("status")}
            >
              <div className="flex items-center">
                Status
                {renderSortIcon("status")}
              </div>
            </th>
            <th
              className="px-4 py-3 text-sm font-medium text-left cursor-pointer hover:bg-white/5"
              onClick={() => onSort("createdAt")}
            >
              <div className="flex items-center">
                Date
                {renderSortIcon("createdAt")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="transition-colors hover:bg-white/5"
            >
              <td className="px-4 py-3">
                <span className="font-mono text-xs">
                  #{tx.id.toLocaleUpperCase().slice(0, 8)}...
                  {tx.id.toLocaleUpperCase().slice(-4)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {tx.fromUser ? `@${tx.fromUser.username}` : "-"}
              </td>
              <td className="px-4 py-3 text-sm">
                {tx.user ? `@${tx.user.username}` : "-"}
              </td>
              <td className="px-4 py-3 text-sm">
                {getTransactionTypeDisplay(tx.transactionType)}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={cn(
                    "font-medium",
                    getWalletTypeColor(tx.walletType)
                  )}
                >
                  {getWalletTypeDisplay(tx.walletType)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">${tx.amount}</td>
              <td className="px-4 py-3 text-sm">{tx.package?.name || "-"}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "text-sm font-medium",
                    getStatusColor(tx.status)
                  )}
                >
                  {tx.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {formatDate(tx.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
