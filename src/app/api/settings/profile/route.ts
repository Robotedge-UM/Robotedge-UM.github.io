import { createAccountUpdatedActivity } from "@/lib/activities"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
})

export async function PUT(request: NextRequest) {
  try {
    // Get user from auth token
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validatedData = profileUpdateSchema.parse(body)

    // Check if email is already taken by another user
    if (validatedData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
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
        isActive: true,
      },
    })

    // Create activity for profile update
    let updateType = ""
    if (validatedData.email) {
      updateType += "email"
    }
    if (validatedData.firstName) {
      updateType += ", first name"
    }
    if (validatedData.lastName) {
      updateType += ", last name"
    }

    updateType = updateType.replace(/^, /, "")

    await createAccountUpdatedActivity(user.id, updateType)

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating profile:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
