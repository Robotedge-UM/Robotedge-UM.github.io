"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PackageTagProps = {
  packageType: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const PACKAGE_COLORS = {
  DUKE: {
    background: "bg-blue-100",
    text: "text-blue-800",
    hover: "hover:bg-blue-100",
  },
  BARON: {
    background: "bg-purple-100",
    text: "text-purple-800",
    hover: "hover:bg-purple-100",
  },
  COUNT: {
    background: "bg-amber-100",
    text: "text-amber-800",
    hover: "hover:bg-amber-100",
  },
  PRINCE: {
    background: "bg-emerald-100",
    text: "text-emerald-800",
    hover: "hover:bg-emerald-100",
  },
  KING: {
    background: "bg-red-100",
    text: "text-red-800",
    hover: "hover:bg-red-100",
  },
}

export function PackageTag({
  packageType,
  size = "md",
  className,
}: PackageTagProps) {
  const packageColorConfig = PACKAGE_COLORS[
    packageType as keyof typeof PACKAGE_COLORS
  ] || {
    background: "bg-gray-100",
    text: "text-gray-800",
    hover: "hover:bg-gray-100",
  }

  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-2.5",
    lg: "text-base py-1 px-3",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        packageColorConfig.background,
        packageColorConfig.text,
        packageColorConfig.hover,
        sizeClasses[size],
        "font-semibold",
        className
      )}
    >
      {packageType}
    </Badge>
  )
}
