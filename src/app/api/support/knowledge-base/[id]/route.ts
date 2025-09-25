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

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const article = await prisma.knowledgeBaseArticle.findUnique({
      where: { id },
      include: {
        relatedTickets: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json(
        { error: "Knowledge base article not found" },
        { status: 404 }
      )
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

// PUT update knowledge base article
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { title, content, category, tags, isPublished } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const article = await prisma.knowledgeBaseArticle.update({
      where: { id },
      data: {
        title,
        content,
        category,
        tags: tags || [],
        isPublished,
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating knowledge base article:", error)
    return NextResponse.json(
      { error: "Failed to update knowledge base article" },
      { status: 500 }
    )
  }
}

// DELETE knowledge base article
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    await prisma.knowledgeBaseArticle.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting knowledge base article:", error)
    return NextResponse.json(
      { error: "Failed to delete knowledge base article" },
      { status: 500 }
    )
  }
}
