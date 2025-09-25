"use client"

import { LoginInput, RegisterInput } from "@/lib/auth"
import { AuthUser } from "@/types/user"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

interface AuthState {
  user?: AuthUser | null
  isLoading: boolean
  error: string | null
  isImpersonating: boolean
}

export function useAuth() {
  const pathname = usePathname()

  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isImpersonating: false,
  })

  const retrieveUser = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch("/api/auth/user")
      if (!response.ok) {
        throw new Error("Failed to retrieve user")
      }

      const user = await response.json()

      // Set impersonation state if user has impersonation data
      setState((prev) => ({
        ...prev,
        user: user || null,
        isLoading: false,
        isImpersonating: user?.isImpersonating || false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        isImpersonating: false,
      }))
    }
  }

  useEffect(() => {
    retrieveUser()
  }, [pathname])

  const login = useCallback(async (credentials: LoginInput) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Login failed")
      }

      const data = await response.json()
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Login failed",
      }))
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const register = useCallback(async (userData: RegisterInput) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Register user directly with MLM placement
      const response = await fetch("/api/auth?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Registration failed")
      }

      const data = await response.json()
      return { user: data.user }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Registration failed",
      }))
      throw error
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const logout = useCallback(async () => {
    const res = await fetch("/api/auth?action=logout", {
      method: "POST",
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to logout")
    }

    await res.json()
    // console.log(response)

    setState({
      user: null,
      isLoading: false,
      error: null,
      isImpersonating: false,
    })
  }, [])

  const startImpersonation = useCallback(async (userId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch("/api/dashboard/users/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to start impersonation")
      }

      // Refresh user data with new impersonation session
      await retrieveUser()

      return true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Impersonation failed",
      }))
      return false
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const exitImpersonation = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch("/api/dashboard/users/impersonate", {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to exit impersonation")
      }

      // Refresh user data with admin session restored
      await retrieveUser()

      return true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to exit impersonation",
      }))
      return false
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isImpersonating: state.isImpersonating,
    login,
    register,
    logout,
    refresh: retrieveUser,
    startImpersonation,
    exitImpersonation,
  }
}
