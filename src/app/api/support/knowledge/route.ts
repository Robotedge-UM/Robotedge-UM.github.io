import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role, TicketCategory, Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

// GET knowledge base articles
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const searchQuery = searchParams.get("search")
    const excludeId = searchParams.get("excludeId")
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")

    // Regular users can only see published articles
    const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPERADMIN

    const where = {
      ...(isAdmin ? {} : { isPublished: true }),
      ...(category && category !== "ALL"
        ? { category: category as TicketCategory }
        : {}),
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
      ...(searchQuery
        ? {
            OR: [
              {
                title: {
                  contains: searchQuery,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                content: {
                  contains: searchQuery,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              { tags: { hasSome: [searchQuery] } },
            ],
          }
        : {}),
    }

    // Get total count for pagination
    const total = await prisma.knowledgeBaseArticle.count({ where })

    // Get articles with pagination
    const articles = await prisma.knowledgeBaseArticle.findMany({
      where,
      orderBy: [{ viewCount: "desc" }, { updatedAt: "desc" }],
      take: limit,
      skip: (page - 1) * limit,
    })

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching knowledge base articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch knowledge base articles" },
      { status: 500 }
    )
  }
}

// POST create new knowledge base article (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category, tags, relatedTicketId, isPublished } =
      body

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create article
    const article = await prisma.knowledgeBaseArticle.create({
      data: {
        title,
        content,
        category: category as TicketCategory,
        tags: tags || [],
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    })

    // If this article is created from a ticket, update the ticket
    if (relatedTicketId) {
      await prisma.supportTicket.update({
        where: { id: relatedTicketId },
        data: { knowledgeBaseId: article.id },
      })
    }

    return NextResponse.json({ success: true, article })
  } catch (error) {
    console.error("Error creating knowledge base article:", error)
    return NextResponse.json(
      { error: "Failed to create knowledge base article" },
      { status: 500 }
    )
  }
}
