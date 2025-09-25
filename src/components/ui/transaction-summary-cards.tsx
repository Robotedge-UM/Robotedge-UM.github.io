import { motion } from "framer-motion"
import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Loader2,
  TrendingUp,
} from "lucide-react"

interface TransactionSummary {
  totalTransactions: number
  totalVolume: number
  thisMonthTransactions: number
  thisMonthVolume: number
  thisYearVolume: number
  commissionVolume: number
  latestTransaction: any | null
  typeBreakdown: Record<string, { count: number; amount: number }>
  monthlyTrend: any[]
}

interface TransactionSummaryCardsProps {
  summary: TransactionSummary | null
  isLoading: boolean
}

export function TransactionSummaryCards({
  summary,
  isLoading,
}: TransactionSummaryCardsProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const summaryCards = [
    {
      title: "Total Volume",
      value: summary ? `$${summary.totalVolume.toFixed(2)}` : "$0.00",
      growth:
        summary?.thisMonthVolume && summary.thisMonthVolume > 0
          ? "+100%"
          : "0%",
      icon: DollarSign,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Monthly Volume",
      value: summary ? `$${summary.thisMonthVolume.toFixed(2)}` : "$0.00",
      growth: "This Month",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Commission Volume",
      value: summary ? `$${summary.commissionVolume.toFixed(2)}` : "$0.00",
      growth: summary?.typeBreakdown?.COMMISSION
        ? `${summary.typeBreakdown.COMMISSION.count} Transactions`
        : "0 Transactions",
      icon: ArrowUpRight,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Total Transactions",
      value: summary?.totalTransactions.toString() || "0",
      growth: `${summary?.thisMonthTransactions || 0} This Month`,
      icon: Clock,
      color: "from-orange-500 to-amber-600",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="p-6 glass-morphism rounded-xl animate-pulse"
          >
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="p-6 glass-morphism rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-semibold">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.growth}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
