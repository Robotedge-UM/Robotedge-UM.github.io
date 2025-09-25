import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const payload = await verifyToken(token)

    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        companyWallet: true,
        registerWallet: true,
        bonusWallet: true,
        isQualified: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const totalBalance =
      user.companyWallet + user.registerWallet + user.bonusWallet

    return NextResponse.json({
      companyWallet: user.companyWallet,
      registerWallet: user.registerWallet,
      bonusWallet: user.bonusWallet,
      totalBalance,
      isQualified: user.isQualified,
    })
  } catch (error) {
    console.error("Error fetching wallet info:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
