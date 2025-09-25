import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get user from auth token
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch bonus settings to determine MLM structure
    const bonusSettings = await prisma.bonusSettings.findFirst({
      select: {
        mlmStructure: true,
        introducerBonusEnabled: true,
        pairingBonusEnabled: true,
        matchingBonusEnabled: true,
      },
    })

    if (!bonusSettings) {
      return NextResponse.json(
        { error: "System not configured" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      structure: bonusSettings.mlmStructure,
      isBinary: bonusSettings.mlmStructure === "BINARY",
      introducerBonusEnabled: bonusSettings.introducerBonusEnabled,
      pairingBonusEnabled: bonusSettings.pairingBonusEnabled,
      matchingBonusEnabled: bonusSettings.matchingBonusEnabled,
    })
  } catch (error) {
    console.error("Error fetching bonus settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch system configuration" },
      { status: 500 }
    )
  }
}
