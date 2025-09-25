import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET - Fetch all research areas
export async function GET() {
  try {
    const researchAreas = await prisma.researchArea.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(researchAreas)
  } catch (error) {
    console.error("Error fetching research areas:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new research area
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, imageUrl, order } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newResearchArea = await prisma.researchArea.create({
      data: {
        title,
        description,
        imageUrl,
        order: order || 0,
      },
    })

    return NextResponse.json(newResearchArea, { status: 201 })
  } catch (error) {
    console.error("Error creating research area:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update an existing research area
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, imageUrl, order, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: "Research area ID is required" },
        { status: 400 }
      )
    }

    const updatedResearchArea = await prisma.researchArea.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        order,
        isActive,
      },
    })

    return NextResponse.json(updatedResearchArea)
  } catch (error) {
    console.error("Error updating research area:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a research area
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Research area ID is required" },
        { status: 400 }
      )
    }

    await prisma.researchArea.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Research area deleted successfully" })
  } catch (error) {
    console.error("Error deleting research area:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
