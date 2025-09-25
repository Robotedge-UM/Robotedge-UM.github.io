import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET - Fetch all news & events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")

    const whereClause: any = { isActive: true }

    if (featured === "true") {
      whereClause.featured = true
    }

    const newsEvents = await prisma.newsEvent.findMany({
      where: whereClause,
      orderBy: [
        { featured: "desc" }, // Featured items first
        { date: "desc" }, // Then by date (newest first)
        { order: "asc" }, // Then by order
      ],
    })

    return NextResponse.json(newsEvents)
  } catch (error) {
    console.error("Error fetching news & events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new news & event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, imageUrl, date, featured, order } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const newNewsEvent = await prisma.newsEvent.create({
      data: {
        title,
        content,
        imageUrl,
        date: date ? new Date(date) : new Date(),
        featured: featured || false,
        order: order || 0,
      },
    })

    return NextResponse.json(newNewsEvent, { status: 201 })
  } catch (error) {
    console.error("Error creating news & event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update an existing news & event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, content, imageUrl, date, featured, order, isActive } =
      body

    if (!id) {
      return NextResponse.json(
        { error: "News & event ID is required" },
        { status: 400 }
      )
    }

    const updatedNewsEvent = await prisma.newsEvent.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl,
        date: date ? new Date(date) : undefined,
        featured,
        order,
        isActive,
      },
    })

    return NextResponse.json(updatedNewsEvent)
  } catch (error) {
    console.error("Error updating news & event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a news & event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "News & event ID is required" },
        { status: 400 }
      )
    }

    await prisma.newsEvent.delete({
      where: { id },
    })

    return NextResponse.json({ message: "News & event deleted successfully" })
  } catch (error) {
    console.error("Error deleting news & event:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
