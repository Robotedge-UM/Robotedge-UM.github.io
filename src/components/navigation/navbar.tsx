"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/useAuth"
import { useOnClickOutside } from "@/lib/hooks/useOnClickOutside"
import { Activity } from "@/lib/hooks/useActivities"
import { useRecentActivities } from "@/lib/hooks/useRecentActivities"
import { useLandingPageSettings } from "@/lib/hooks/useLandingPageSettings"
import { cn } from "@/lib/utils"
import {
  Bell,
  ChevronDown,
  Check,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"

interface NavbarProps {
  onToggleSidebar?: () => void
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const router = useRouter()
  const { user, logout, isImpersonating, exitImpersonation } = useAuth()
  const { settings } = useLandingPageSettings()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const { activities, unseenCount, isLoading, markAsSeen, markAllAsSeen } =
    useRecentActivities(5) // Fetch 5 most recent activities

  useOnClickOutside(profileRef, () => setIsProfileOpen(false))
  useOnClickOutside(notificationsRef, () => setIsNotificationsOpen(false))

  const handleSignOut = async () => {
    await logout()
    router.push("/login")
    router.refresh()
  }

  const handleExitImpersonation = async () => {
    const success = await exitImpersonation()
    if (success) {
      router.push("/dashboard/users")
      router.refresh()
      setIsProfileOpen(false)
    }
  }

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true)

    // Mark notifications as seen when opened
    if (activities.length > 0) {
      const unseenActivityIds = activities
        .filter((activity) => !activity.seen)
        .map((activity) => activity.id)

      if (unseenActivityIds.length > 0) {
        markAsSeen(unseenActivityIds)
      }
    }
  }

  const getActivityIcon = (activity: Activity) => {
    switch (activity.activityType) {
      case "REGISTRATION":
        return <User className="w-4 h-4 text-primary" />
      case "PACKAGE_UPGRADE":
        return <ChevronDown className="w-4 h-4 text-success" />
      case "COMMISSION_EARNED":
        return <Check className="w-4 h-4 text-success" />
      case "COMMISSION_SENT":
        return <Check className="w-4 h-4 text-warning" />
      case "REFERRAL_ADDED":
        return <User className="w-4 h-4 text-primary" />
      default:
        return <Bell className="w-4 h-4 text-primary" />
    }
  }

  return (
    <>
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white py-1 px-4 text-center text-sm font-medium">
          <div className="container mx-auto">
            You are impersonating a user.{" "}
            <button
              onClick={handleExitImpersonation}
              className="underline font-bold"
            >
              Exit impersonation
            </button>
          </div>
        </div>
      )}

      <nav
        className={`fixed ${
          isImpersonating ? "top-7" : "top-0"
        } left-0 right-0 h-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b border-primary/10 shadow-sm`}
      >
        <div className="flex items-center h-full px-4 mx-auto sm:px-6 max-w-7xl">
          {user && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 mr-4 transition-colors rounded-full hover:bg-primary/10"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-primary" />
            </button>
          )}

          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 mr-8"
          >
            <div className="relative flex items-center justify-center w-10 h-10">
              {settings?.companyLogo ? (
                <Image
                  src={settings.companyLogo}
                  alt={`${settings.companyName || "Company"} Logo`}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              ) : (
                <Image
                  src="/android-chrome-192x192.png"
                  alt={`${settings?.companyName || "Robotedge"} Logo`}
                  width={50}
                  height={50}
                  className="dark:invert"
                />
              )}
            </div>
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              {settings?.companyName || "Robotedge"}
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="items-center hidden ml-4 space-x-6 md:flex">
            <Link
              href="/packages"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Packages
            </Link>
            <Link
              href="/faqs"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              FAQs
            </Link>
          </div>

          {user ? (
            // Authenticated navigation
            <>
              <div
                className={cn(
                  "hidden lg:flex items-center h-10 rounded-full bg-muted px-3 flex-1 max-w-md transition-all duration-300 border border-primary/10 focus-within:border-primary/30 ml-6 mr-2",
                  isSearchOpen ? "w-full" : "w-40"
                )}
              >
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="flex w-full px-2 py-2 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <div
                  className="relative"
                  ref={notificationsRef}
                >
                  <button
                    className={cn(
                      "relative p-2 rounded-full transition-colors",
                      isNotificationsOpen
                        ? "bg-primary/10"
                        : "hover:bg-primary/10"
                    )}
                    aria-label="Notifications"
                    onClick={handleOpenNotifications}
                  >
                    <Bell className="w-5 h-5" />
                    {unseenCount > 0 && (
                      <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-medium text-white rounded-full bg-primary top-0 right-0 -mt-1 -mr-1">
                        {unseenCount > 9 ? "9+" : unseenCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 z-50 w-80 p-2 mt-2 bg-card shadow-lg rounded-xl ring-1 ring-border focus:outline-none max-h-[500px] overflow-auto">
                      <div className="flex items-center justify-between p-3 border-b border-primary/10">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAllAsSeen()}
                          className="text-xs"
                        >
                          Mark all as read
                        </Button>
                      </div>

                      <div className="py-2">
                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="w-6 h-6 border-2 border-t-primary rounded-full animate-spin"></div>
                          </div>
                        ) : activities.length > 0 ? (
                          <>
                            {activities.map((activity) => (
                              <div
                                key={activity.id}
                                className={cn(
                                  "flex gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer",
                                  !activity.seen && "bg-primary/5"
                                )}
                              >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                  {getActivityIcon(activity)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">
                                    {activity.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {activity.description}
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                      new Date(activity.createdAt),
                                      { addSuffix: true }
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))}

                            <div className="px-3 py-2 mt-2 border-t border-primary/10">
                              <Link
                                href="/dashboard/activities"
                                className="block w-full py-2 text-xs text-center transition-colors rounded-lg text-primary hover:bg-primary/10"
                                onClick={() => setIsNotificationsOpen(false)}
                              >
                                View all activities
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="py-6 text-center">
                            <p className="text-sm text-muted-foreground">
                              No notifications yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  ref={profileRef}
                  className="relative"
                >
                  <button
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-full transition-colors",
                      isProfileOpen ? "bg-primary/10" : "hover:bg-primary/10"
                    )}
                    aria-label="User profile"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      {user.username?.[0] || <User className="w-5 h-5" />}
                    </div>
                    <span className="hidden font-medium sm:inline-block">
                      {user.username || "Profile"}
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-70" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 z-50 w-56 p-2 mt-2 bg-card shadow-lg rounded-xl ring-1 ring-border focus:outline-none">
                      <div className="px-4 py-3 border-b border-primary/10">
                        <p className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs truncate text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm transition-colors rounded-lg hover:bg-primary/10"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm transition-colors rounded-lg hover:bg-primary/10"
                      >
                        Settings
                      </Link>
                      {isImpersonating && (
                        <button
                          className="flex items-center w-full gap-2 px-4 py-2 mt-1 text-sm transition-colors rounded-lg text-destructive hover:bg-destructive/10"
                          onClick={handleExitImpersonation}
                        >
                          <LogOut className="w-4 h-4" />
                          Exit impersonation
                        </button>
                      )}
                      <button
                        className="flex items-center w-full gap-2 px-4 py-2 mt-1 text-sm transition-colors rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Unauthenticated navigation
            <div className="flex items-center gap-4 ml-auto">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  rounded
                  className="mr-2"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="default"
                  size="sm"
                  rounded
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
