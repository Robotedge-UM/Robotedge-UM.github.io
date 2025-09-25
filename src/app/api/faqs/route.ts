import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
