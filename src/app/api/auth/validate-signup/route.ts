import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username } = body

    if (!email || !username) {
      return NextResponse.json(
        { error: "Email and username are required" },
        { status: 400 }
      )
    }

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    // Check for existing username
    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    return NextResponse.json({
      isEmailTaken: !!existingEmail,
      isUsernameTaken: !!existingUsername,
    })
  } catch (error) {
    console.error("Error validating user details:", error)
    return NextResponse.json(
      { error: "Failed to validate user details" },
      { status: 500 }
    )
  }
}
