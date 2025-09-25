import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role, TicketCategory } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

// GET knowledge base articles
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const searchQuery = searchParams.get("search")

    const articles = await prisma.knowledgeBaseArticle.findMany({
      where: {
        ...(category && category !== "ALL"
          ? { category: category as TicketCategory }
          : {}),
        ...(searchQuery
          ? {
              OR: [
                { title: { contains: searchQuery, mode: "insensitive" } },
                { content: { contains: searchQuery, mode: "insensitive" } },
                { tags: { hasSome: [searchQuery] } },
              ],
            }
          : {}),
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error fetching knowledge base articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch knowledge base articles" },
      { status: 500 }
    )
  }
}

// POST create new knowledge base article
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category, tags, isPublished = false } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const article = await prisma.knowledgeBaseArticle.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        isPublished,
      },
    })

    return NextResponse.json({ article })
  } catch (error) {
    console.error("Error creating knowledge base article:", error)
    return NextResponse.json(
      { error: "Failed to create knowledge base article" },
      { status: 500 }
    )
  }
}
