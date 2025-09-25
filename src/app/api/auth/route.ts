import {
  login,
  loginSchema,
  logout,
  register,
  registerSchema,
} from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = request.nextUrl.searchParams.get("action")

    switch (action) {
      case "login": {
        const data = loginSchema.parse(body)
        const result = await login(data)
        return NextResponse.json(result)
      }

      case "register": {
        try {
          // Validate user data
          const validatedUserData = registerSchema.parse(body)

          // Register user with MLM placement
          const result = await register(validatedUserData)

          return NextResponse.json({
            success: true,
            user: result.user,
            token: result.token,
          })
        } catch (error) {
          if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
          }
          return NextResponse.json(
            { error: "Failed to complete registration" },
            { status: 400 }
          )
        }
      }

      case "logout": {
        // Clear the auth token cookie
        await logout()
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
