import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AuthUser } from "@/types/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const payload = await verifyToken(token)

    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user data
    const user = await prisma.user.findFirstOrThrow({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        package: {
          select: {
            name: true,
            packageType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    // Create the AuthUser object with base user data
    const authUser: AuthUser = {
      ...user,
      packageType: user.package?.packageType?.name || null,
      packageName: user.package?.name || null,
    }

    // If this is an impersonation session, add the impersonation data
    if (payload.isImpersonating) {
      authUser.isImpersonating = true
      authUser.adminId = payload.adminId
      authUser.adminRole = payload.adminRole
    }

    return NextResponse.json(authUser)
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    )
  }
}
