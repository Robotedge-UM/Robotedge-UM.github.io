"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useLandingPageSettings } from "@/lib/hooks/useLandingPageSettings"
import { useEffect, ReactNode } from "react"

interface ThemeProviderProps {
  children: ReactNode
  attribute?: "class" | "data-theme"
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      {...props}
    >
      <DynamicThemeInjector />
      {children}
    </NextThemesProvider>
  )
}

function DynamicThemeInjector() {
  const { settings } = useLandingPageSettings()

  useEffect(() => {
    if (typeof document === "undefined" || !settings) return

    // Apply dynamic theme colors
    const root = document.documentElement

    if (settings.primaryColor) {
      root.style.setProperty("--color-primary", settings.primaryColor)
      root.style.setProperty(
        "--color-primary-rgb",
        hexToRgb(settings.primaryColor)
      )

      // Set lighter version for dark mode
      const rgb = hexToRgb(settings.primaryColor)
      const [r, g, b] = rgb
        .split(", ")
        .map((n) => Math.min(255, parseInt(n) + 40))
      root.style.setProperty("--color-dark-primary", `rgb(${r}, ${g}, ${b})`)
    }

    if (settings.secondaryColor) {
      root.style.setProperty("--color-secondary", settings.secondaryColor)
      root.style.setProperty(
        "--color-secondary-rgb",
        hexToRgb(settings.secondaryColor)
      )

      // Set lighter version for dark mode
      const rgb = hexToRgb(settings.secondaryColor)
      const [r, g, b] = rgb
        .split(", ")
        .map((n) => Math.min(255, parseInt(n) + 40))
      root.style.setProperty("--color-dark-secondary", `rgb(${r}, ${g}, ${b})`)
    }
  }, [settings])

  return null
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
