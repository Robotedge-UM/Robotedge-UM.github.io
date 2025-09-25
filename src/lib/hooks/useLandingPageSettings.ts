"use client"

import { useState, useEffect } from "react"

export interface LandingPageSettings {
  companyName: string
  companyLogo?: string
  primaryColor: string
  secondaryColor: string
  heroTitle: string
  heroSubtitle: string
  heroImage?: string
  activeMembersCount: string
  totalCommissions: string
  memberSatisfaction: string
  contactEmail?: string
  contactPhone?: string
  supportEmail?: string
  facebookUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  metaTitle: string
  metaDescription: string
}

export function useLandingPageSettings() {
  const [settings, setSettings] = useState<LandingPageSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/landing-pages/settings")
        if (!response.ok) {
          throw new Error("Failed to fetch landing page settings")
        }
        const data = await response.json()
        setSettings(data)

        // Apply theme colors to CSS variables when settings are loaded
        if (data.primaryColor || data.secondaryColor) {
          applyThemeColors(data.primaryColor, data.secondaryColor)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        // Use default settings on error
        const defaultSettings: LandingPageSettings = {
          companyName: "ModularMLM",
          primaryColor: "#3B82F6",
          secondaryColor: "#10B981",
          heroTitle: "ModularMLM",
          heroSubtitle:
            "Advanced multi-level marketing platform with binary tree structure, comprehensive package management, multiple bonus systems, and modular architecture that scales with your business.",
          activeMembersCount: "1000+",
          totalCommissions: "$500K+",
          memberSatisfaction: "95%",
          metaTitle: "ModularMLM - Advanced Multi-Level Marketing System",
          metaDescription:
            "A comprehensive modular MLM platform with binary tree structure, package management, bonus systems, and inventory tracking.",
        }
        setSettings(defaultSettings)
        applyThemeColors(
          defaultSettings.primaryColor,
          defaultSettings.secondaryColor
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return "59, 130, 246" // default blue

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `${r}, ${g}, ${b}`
}

// Helper function to apply theme colors to CSS variables
function applyThemeColors(primaryColor?: string, secondaryColor?: string) {
  if (typeof document === "undefined") return

  const primary = primaryColor || "#3B82F6"
  const secondary = secondaryColor || "#10B981"

  // Update CSS custom properties
  document.documentElement.style.setProperty("--color-primary", primary)
  document.documentElement.style.setProperty("--color-secondary", secondary)

  // Update RGB versions for transparency effects
  document.documentElement.style.setProperty(
    "--color-primary-rgb",
    hexToRgb(primary)
  )
  document.documentElement.style.setProperty(
    "--color-secondary-rgb",
    hexToRgb(secondary)
  )

  // Update dark mode versions (slightly lighter for dark backgrounds)
  const primaryRgb = hexToRgb(primary)
  const secondaryRgb = hexToRgb(secondary)

  // Make colors slightly lighter for dark mode
  const [pr, pg, pb] = primaryRgb
    .split(", ")
    .map((n) => Math.min(255, parseInt(n) + 40))
  const [sr, sg, sb] = secondaryRgb
    .split(", ")
    .map((n) => Math.min(255, parseInt(n) + 40))

  document.documentElement.style.setProperty(
    "--color-dark-primary",
    `rgb(${pr}, ${pg}, ${pb})`
  )
  document.documentElement.style.setProperty(
    "--color-dark-secondary",
    `rgb(${sr}, ${sg}, ${sb})`
  )
}
