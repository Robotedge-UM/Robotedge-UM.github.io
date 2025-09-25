import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { NextRequest, NextResponse } from "next/server"
import { join } from "path"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const path = (await params).path

    if (!path || path.length < 2) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 })
    }

    const folder = path[0]
    const filename = path.slice(1).join("/") // Handle nested paths

    // Construct file path
    const storageDir = process.env.STORAGE_DIR || join(process.cwd(), "storage")
    const filePath = join(storageDir, "public", folder, filename)

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read file
    const fileBuffer = await readFile(filePath)

    // Determine content type based on file extension
    const extension = filename.split(".").pop()?.toLowerCase()
    let contentType = "application/octet-stream"

    switch (extension) {
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg"
        break
      case "png":
        contentType = "image/png"
        break
      case "gif":
        contentType = "image/gif"
        break
      case "webp":
        contentType = "image/webp"
        break
      case "svg":
        contentType = "image/svg+xml"
        break
    }

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
      },
    })
  } catch (error) {
    console.error("Error serving public image:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
