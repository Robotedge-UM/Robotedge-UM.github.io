import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

// GET support settings
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get existing settings or create with defaults if none exist
    let settings = await prisma.supportSettings.findFirst()

    if (!settings) {
      settings = await prisma.supportSettings.create({
        data: {
          criticalResponseTarget: 2,
          highResponseTarget: 6,
          mediumResponseTarget: 12,
          lowResponseTarget: 24,
          autoEscalateAfter: 24,
          enableAutoAssignment: true,
          autoSuggestKnowledgeBase: true,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching support settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch support settings" },
      { status: 500 }
    )
  }
}

// PUT update support settings
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      criticalResponseTarget,
      highResponseTarget,
      mediumResponseTarget,
      lowResponseTarget,
      autoEscalateAfter,
      enableAutoAssignment,
      autoSuggestKnowledgeBase,
    } = body

    // Validate required fields
    if (
      !id ||
      criticalResponseTarget === undefined ||
      highResponseTarget === undefined ||
      mediumResponseTarget === undefined ||
      lowResponseTarget === undefined ||
      autoEscalateAfter === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate response time values
    if (
      criticalResponseTarget < 0 ||
      highResponseTarget < 0 ||
      mediumResponseTarget < 0 ||
      lowResponseTarget < 0 ||
      autoEscalateAfter < 0
    ) {
      return NextResponse.json(
        { error: "Response time values cannot be negative" },
        { status: 400 }
      )
    }

    const settings = await prisma.supportSettings.update({
      where: { id },
      data: {
        criticalResponseTarget,
        highResponseTarget,
        mediumResponseTarget,
        lowResponseTarget,
        autoEscalateAfter,
        enableAutoAssignment,
        autoSuggestKnowledgeBase,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating support settings:", error)
    return NextResponse.json(
      { error: "Failed to update support settings" },
      { status: 500 }
    )
  }
}
