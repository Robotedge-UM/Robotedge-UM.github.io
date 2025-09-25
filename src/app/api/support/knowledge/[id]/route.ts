import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

// GET single knowledge base article
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    // Only allow published articles for regular users
    const { id } = params
    const article = await prisma.knowledgeBaseArticle.findUnique({
      where: {
        id,
        ...(user?.role !== Role.ADMIN && user?.role !== Role.SUPERADMIN
          ? { isPublished: true }
          : {}),
      },
    })

    if (!article) {
      return NextResponse.json(
        { error: "Knowledge base article not found" },
        { status: 404 }
      )
    }

    // Increment view count for non-admin users
    if (user?.role !== Role.ADMIN && user?.role !== Role.SUPERADMIN) {
      await prisma.knowledgeBaseArticle.update({
        where: { id },
        data: {
          viewCount: { increment: 1 },
        },
      })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching knowledge base article:", error)
    return NextResponse.json(
      { error: "Failed to fetch knowledge base article" },
      { status: 500 }
    )
  }
}
