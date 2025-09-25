import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { HomeSectionType } from "@prisma/client"

// GET - Fetch all home sections or a specific section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionType = searchParams.get("section") as HomeSectionType | null

    if (sectionType) {
      const section = await prisma.homeSection.findUnique({
        where: { section: sectionType },
      })

      if (!section) {
        return NextResponse.json(
          { error: "Section not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(section)
    }

    const sections = await prisma.homeSection.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error("Error fetching home sections:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new home section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, title, subtitle, content, imageUrl, order, metadata } =
      body

    // Validate required fields
    if (!section || !Object.values(HomeSectionType).includes(section)) {
      return NextResponse.json(
        { error: "Invalid section type" },
        { status: 400 }
      )
    }

    const newSection = await prisma.homeSection.create({
      data: {
        section,
        title,
        subtitle,
        content,
        imageUrl,
        order: order || 0,
        metadata,
      },
    })

    return NextResponse.json(newSection, { status: 201 })
  } catch (error) {
    console.error("Error creating home section:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update an existing home section
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      section,
      title,
      subtitle,
      content,
      imageUrl,
      order,
      metadata,
      isActive,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      )
    }

    const updatedSection = await prisma.homeSection.update({
      where: { id },
      data: {
        title,
        subtitle,
        content,
        imageUrl,
        order,
        metadata,
        isActive,
      },
    })

    return NextResponse.json(updatedSection)
  } catch (error) {
    console.error("Error updating home section:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a home section
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Section ID is required" },
        { status: 400 }
      )
    }

    await prisma.homeSection.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Section deleted successfully" })
  } catch (error) {
    console.error("Error deleting home section:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
