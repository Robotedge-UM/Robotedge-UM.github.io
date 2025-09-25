import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

// Add paths that should be protected by authentication
const protectedPaths = [
  "/api/dashboard",
  "/api/referrals",
  "/api/transactions",
  "/dashboard",
  "/referrals",
  "/profile",
  "/admin",
  "/superadmin",
  // Add more protected paths here
]

// Add paths that should be accessible only by specific roles
const roleProtectedPaths: Record<string, string[]> = {
  "/api/admin": ["ADMIN", "SUPERADMIN"],
  "/api/superadmin": ["SUPERADMIN"],
  "/admin": ["ADMIN", "SUPERADMIN"],
  "/superadmin": ["SUPERADMIN"],
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if path needs authentication
  const needsAuth = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  )

  // Check if path has role requirements
  const requiredRoles = Object.entries(roleProtectedPaths).find(
    ([protectedPath]) => path.startsWith(protectedPath)
  )?.[1]

  if (!needsAuth && !requiredRoles) {
    return NextResponse.next()
  }

  const token = request.cookies.get("auth-token")?.value
  const payload = await verifyToken(token)
  // console.log("payload", payload)

  // For API routes, return JSON responses
  if (path.startsWith("/api/")) {
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check role requirements for API routes
    if (requiredRoles && !requiredRoles.includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Add user to request headers for route handlers
    const headers = new Headers(request.headers)
    headers.set("x-user-id", payload.id)
    headers.set("x-user-role", payload.role)

    return NextResponse.next({
      request: {
        headers,
      },
    })
  }
  // For page routes, use redirects
  else {
    // If not authenticated, redirect to login
    if (!payload) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    // If authenticated but wrong role, redirect to dashboard
    if (requiredRoles && !requiredRoles.includes(payload.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // User is authenticated and has the correct role (if required)
    const headers = new Headers(request.headers)
    headers.set("x-user-id", payload.id)
    headers.set("x-user-role", payload.role)

    return NextResponse.next({
      request: {
        headers,
      },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login page itself (to avoid redirect loops)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|login).*)",
  ],
}
