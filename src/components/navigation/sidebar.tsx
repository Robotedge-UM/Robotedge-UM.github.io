"use client"

import { useAuth } from "@/lib/hooks/useAuth"
import { usePackageProgress } from "@/lib/hooks/usePackageProgress"
import { useWalletInfo } from "@/lib/hooks/useWalletInfo"
import { useLandingPageSettings } from "@/lib/hooks/useLandingPageSettings"
import { cn } from "@/lib/utils"
import { Role } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import {
  BarChart3,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Crown,
  DollarSign,
  Gift,
  Home,
  Loader2,
  Network,
  Presentation,
  Settings,
  Star,
  Users,
  Package,
  Box,
  Calculator,
  Palette,
  HelpCircle,
  Wallet,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface MenuItem {
  label: string
  icon: React.ElementType
  href?: string
  roles: Role[]
  children?: MenuItem[]
}

interface MenuGroup {
  label: string
  items: MenuItem[]
  roles: Role[]
}

const menuGroups: MenuGroup[] = [
  {
    label: "Overview",
    roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
    items: [
      {
        label: "Dashboard",
        icon: Home,
        href: "/dashboard",
        roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
      },
      {
        label: "Activities",
        icon: BarChart3,
        href: "/dashboard/activities",
        roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
      },
    ],
  },
  {
    label: "MLM System",
    roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
    items: [
      {
        label: "Genealogy",
        icon: Network,
        href: "/dashboard/referrals",
        roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
      },
      {
        label: "Earnings",
        icon: DollarSign,
        href: "/dashboard/earnings",
        roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
      },
      {
        label: "PV History",
        icon: BarChart3,
        href: "/dashboard/pv-history",
        roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
      },
    ],
  },
  {
    label: "Business",
    roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
    items: [
      {
        label: "Packages",
        icon: Gift,
        href: "/dashboard/packages",
        roles: [Role.USER, Role.ADMIN],
      },
      {
        label: "Transactions",
        icon: CreditCard,
        href: "/dashboard/transactions",
        roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
      },
      {
        label: "Marketing",
        icon: Presentation,
        href: "/dashboard/marketing",
        roles: [Role.USER],
      },
    ],
  },
  {
    label: "Support",
    roles: [Role.USER, Role.ADMIN, Role.SUPERADMIN],
    items: [
      {
        label: "Support",
        icon: ClipboardList,
        href: "/dashboard/support",
        roles: [Role.USER],
      },
      {
        label: "Support Admin",
        icon: ClipboardList,
        href: "/dashboard/support-admin",
        roles: [Role.ADMIN, Role.SUPERADMIN],
      },
    ],
  },
  {
    label: "Administration",
    roles: [Role.ADMIN, Role.SUPERADMIN],
    items: [
      {
        label: "User Management",
        icon: Users,
        href: "/dashboard/users",
        roles: [Role.SUPERADMIN],
      },
      {
        label: "Marketing Admin",
        icon: Presentation,
        href: "/dashboard/marketing-admin",
        roles: [Role.ADMIN, Role.SUPERADMIN],
      },
      {
        label: "Box Management",
        icon: Box,
        href: "/dashboard/boxes",
        roles: [Role.ADMIN, Role.SUPERADMIN],
      },
      {
        label: "Package Management",
        icon: Package,
        href: "/dashboard/package-management",
        roles: [Role.ADMIN, Role.SUPERADMIN],
      },
      {
        label: "Landing Pages",
        icon: Palette,
        roles: [Role.ADMIN, Role.SUPERADMIN],
        children: [
          {
            label: "Page Settings",
            icon: Settings,
            href: "/admin/landing-pages/settings",
            roles: [Role.ADMIN, Role.SUPERADMIN],
          },
          {
            label: "FAQ Management",
            icon: HelpCircle,
            href: "/admin/faqs",
            roles: [Role.ADMIN, Role.SUPERADMIN],
          },
        ],
      },
      {
        label: "System Settings",
        icon: Settings,
        href: "/dashboard/system-settings",
        roles: [Role.SUPERADMIN],
      },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, isImpersonating } = useAuth()
  const { settings } = useLandingPageSettings()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  )
  const [expandedSubmenus, setExpandedSubmenus] = useState<
    Record<string, boolean>
  >({})
  const [isUserInfoExpanded, setIsUserInfoExpanded] = useState(true)
  const { progress, isLoading } = usePackageProgress()
  const { walletInfo, isLoading: isWalletLoading } = useWalletInfo()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Filter menu groups based on user role
  const filteredMenuGroups = menuGroups
    .filter((group) => group.roles.includes(user?.role as Role))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.roles.includes(user?.role as Role)
      ),
    }))

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupLabel]: !prev[groupLabel],
    }))
  }

  const toggleSubmenu = (itemLabel: string) => {
    setExpandedSubmenus((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }))
  }

  // Sidebar animation variants
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0.5 },
  }

  // Overlay animation variants
  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  }

  // Helper function to format package name for display
  const formatPackageName = (packageType: string | null) => {
    if (!packageType) return "No Package"

    return (
      packageType.charAt(0).toUpperCase() + packageType.slice(1).toLowerCase()
    )
  }

  // Helper function to get milestone text
  const getMilestoneText = () => {
    if (!progress) return "Loading..."

    return `${progress.totalEarnings} / ${progress.maxMilestone} USDT`
  }

  // Check if user has KING package and has reached max milestone
  const isKingMaxMilestone = () => {
    if (!progress || isLoading) return false
    return progress.packageTypeName === "KING"
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-16 bottom-0 left-0 bg-white/90 w-64 z-40 glass-morphism border-r border-white/10 dark:border-white/5 shadow-xl overflow-hidden",
          isImpersonating ? "top-24" : "top-16"
        )}
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 to-secondary/5" />

        <nav className="relative flex flex-col h-full">
          <div className="flex-1 px-3 py-4 pr-2 space-y-1 overflow-y-auto">
            {filteredMenuGroups.map((group, groupIndex) => {
              const isGroupExpanded = expandedGroups[group.label] ?? true

              return (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: groupIndex * 0.1,
                  }}
                  className="mb-2"
                >
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{group.label}</span>
                    <motion.div
                      animate={{ rotate: isGroupExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </motion.div>
                  </button>

                  {/* Group Items */}
                  <AnimatePresence>
                    {isGroupExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-0.5"
                      >
                        {group.items.map((item, itemIndex) => {
                          if (item.children) {
                            // Render submenu
                            const isSubmenuExpanded =
                              expandedSubmenus[item.label] ?? false
                            const Icon = item.icon

                            return (
                              <div key={item.label}>
                                <button
                                  onClick={() => toggleSubmenu(item.label)}
                                  className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-black/5"
                                >
                                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
                                    <Icon className="w-3 h-3 text-primary" />
                                  </div>
                                  <span className="flex-1 text-left">
                                    {item.label}
                                  </span>
                                  <motion.div
                                    animate={{
                                      rotate: isSubmenuExpanded ? 90 : 0,
                                    }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ChevronRight className="w-3 h-3" />
                                  </motion.div>
                                </button>

                                <AnimatePresence>
                                  {isSubmenuExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="ml-8 space-y-0.5"
                                    >
                                      {item.children.map((child) => {
                                        const isActive = pathname === child.href
                                        const ChildIcon = child.icon

                                        return (
                                          <Link
                                            key={child.href}
                                            href={child.href!}
                                            className={cn(
                                              "flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200",
                                              isActive
                                                ? "bg-gradient-to-r from-primary/90 to-secondary/90 text-white shadow-sm"
                                                : "hover:bg-black/5"
                                            )}
                                            onClick={
                                              isMobile ? onClose : undefined
                                            }
                                          >
                                            <ChildIcon
                                              className={cn(
                                                "h-3 w-3",
                                                isActive
                                                  ? "text-white"
                                                  : "text-primary"
                                              )}
                                            />
                                            <span>{child.label}</span>
                                          </Link>
                                        )
                                      })}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          } else {
                            // Render regular menu item
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                              <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: itemIndex * 0.02,
                                }}
                              >
                                <Link
                                  href={item.href!}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                      ? "bg-gradient-to-r from-primary/90 to-secondary/90 text-white shadow-sm"
                                      : "hover:bg-black/5"
                                  )}
                                  onClick={isMobile ? onClose : undefined}
                                >
                                  <div
                                    className={cn(
                                      "flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200",
                                      isActive ? "bg-white/20" : "bg-primary/10"
                                    )}
                                  >
                                    <Icon
                                      className={cn(
                                        "h-3 w-3 transition-all duration-200",
                                        isActive ? "text-white" : "text-primary"
                                      )}
                                    />
                                  </div>
                                  <span>{item.label}</span>
                                </Link>
                              </motion.div>
                            )
                          }
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Compact User Info Section - Collapsible */}
          <motion.div
            className="border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Collapsible Header */}
            <button
              onClick={() => setIsUserInfoExpanded(!isUserInfoExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold transition-colors text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  <span>Account Info</span>
                </div>
                {/* Quick status indicators */}
                <div className="flex items-center gap-1">
                  {isWalletLoading ? (
                    <Loader2 className="w-2 h-2 animate-spin" />
                  ) : (
                    <>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          walletInfo?.isQualified
                            ? "bg-green-500"
                            : "bg-red-500"
                        )}
                      />
                      {isKingMaxMilestone() && (
                        <Crown className="w-2 h-2 text-amber-500" />
                      )}
                    </>
                  )}
                </div>
              </div>
              <motion.div
                animate={{ rotate: isUserInfoExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-3 h-3" />
              </motion.div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
              {isUserInfoExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-3 pb-3"
                >
                  {/* Combined Package & Status Card */}
                  <div
                    className={cn(
                      "relative p-2.5 border rounded-lg mb-2",
                      isKingMaxMilestone()
                        ? "bg-gradient-to-r from-yellow-500/15 to-amber-300/15 border-amber-400/25"
                        : "bg-gradient-to-r from-primary/8 to-secondary/8 border-white/10"
                    )}
                  >
                    {/* VIP Badge */}
                    {isKingMaxMilestone() && (
                      <motion.div
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-[8px] font-bold px-1 py-0.5 rounded-full shadow-sm border border-amber-200 flex items-center gap-0.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 10,
                          delay: 0.5,
                        }}
                      >
                        <Crown className="w-1.5 h-1.5" />
                        <span>VIP</span>
                      </motion.div>
                    )}

                    {/* Package Info Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-[8px] text-muted-foreground">
                          Current Package
                        </div>
                        <div
                          className={cn(
                            "text-sm font-bold flex items-center",
                            isKingMaxMilestone()
                              ? "text-transparent bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text"
                              : "text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text"
                          )}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <Loader2 className="w-2.5 h-2.5 mr-1 animate-spin" />
                              <span className="text-muted-foreground">
                                Loading...
                              </span>
                            </span>
                          ) : (
                            <>
                              {isKingMaxMilestone() && (
                                <Crown className="w-2.5 h-2.5 mr-1 text-amber-500" />
                              )}
                              {formatPackageName(
                                progress?.packageTypeName || null
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-1">
                        {isWalletLoading ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin text-muted-foreground" />
                        ) : walletInfo?.isQualified ? (
                          <div className="flex items-center gap-0.5 bg-green-500/15 text-green-600 text-[12px] font-bold px-1.5 py-0.5 rounded-full">
                            <CheckCircle className="w-2 h-2" />
                            <span>Qualified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-0.5 bg-red-500/15 text-red-600 text-[12px] font-bold px-1.5 py-0.5 rounded-full">
                            <XCircle className="w-2 h-2" />
                            <span>Not Qualified</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar or VIP Status */}
                    {isKingMaxMilestone() ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 3, -3, 0],
                              }}
                              transition={{
                                duration: 1.2,
                                delay: 0.6 + i * 0.1,
                                repeat: Infinity,
                                repeatDelay: 3,
                              }}
                            >
                              <Star className="w-1.5 h-1.5 fill-amber-400 text-amber-500" />
                            </motion.div>
                          ))}
                        </div>
                        <div className="text-[12px] font-bold text-amber-600 mb-1">
                          MAX MILESTONE REACHED
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>Progress</span>
                          <span>
                            {isLoading
                              ? "..."
                              : `${progress?.progressPercentage || 0}%`}
                          </span>
                        </div>
                        <div className="w-full h-1 overflow-hidden rounded-full bg-white/10">
                          {isLoading ? (
                            <div className="w-1/3 h-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
                          ) : (
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary to-secondary"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${progress?.progressPercentage || 0}%`,
                              }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {isLoading ? "Loading..." : getMilestoneText()}
                        </div>
                      </div>
                    )}

                    {/* Upgrade Link */}
                    {progress?.nextPackageName && !isKingMaxMilestone() && (
                      <div className="pt-1.5 mt-1.5 border-t border-white/10">
                        <Link
                          href="/dashboard/packages"
                          className="flex items-center justify-between text-[10px] transition-colors text-primary hover:text-primary/80"
                        >
                          <span>
                            Upgrade to{" "}
                            {formatPackageName(progress.nextPackageName)}
                          </span>
                          <ChevronRight className="w-2 h-2" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Compact Wallet Grid */}
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/15 border border-blue-500/20 rounded-md p-1.5 text-center">
                      <Wallet className="w-2.5 h-2.5 text-blue-600 mx-auto mb-0.5" />
                      <div className="text-[10px] text-blue-600 font-medium mb-0.5">
                        Company
                      </div>
                      <div className="text-[10px] font-bold text-blue-600">
                        $
                        {isWalletLoading
                          ? "..."
                          : walletInfo?.companyWallet?.toFixed(0) || "0"}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/15 to-green-600/15 border border-green-500/20 rounded-md p-1.5 text-center">
                      <Wallet className="w-2.5 h-2.5 text-green-600 mx-auto mb-0.5" />
                      <div className="text-[10px] text-green-600 font-medium mb-0.5">
                        Register
                      </div>
                      <div className="text-[10px] font-bold text-green-600">
                        $
                        {isWalletLoading
                          ? "..."
                          : walletInfo?.registerWallet?.toFixed(0) || "0"}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/15 to-purple-600/15 border border-purple-500/20 rounded-md p-1.5 text-center">
                      <Wallet className="w-2.5 h-2.5 text-purple-600 mx-auto mb-0.5" />
                      <div className="text-[10px] text-purple-600 font-medium mb-0.5">
                        Bonus
                      </div>
                      <div className="text-[10px] font-bold text-purple-600">
                        $
                        {isWalletLoading
                          ? "..."
                          : walletInfo?.bonusWallet?.toFixed(0) || "0"}
                      </div>
                    </div>
                  </div>

                  {/* Total Balance */}
                  <div className="p-2 text-center border rounded-md bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                    <div className="text-[9px] text-muted-foreground mb-0.5">
                      Total Balance
                    </div>
                    <div className="text-sm font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                      $
                      {isWalletLoading
                        ? "..."
                        : walletInfo?.totalBalance?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>
      </motion.aside>
    </>
  )
}
