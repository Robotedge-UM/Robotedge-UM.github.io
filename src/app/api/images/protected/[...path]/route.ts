import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value
    const payload = await verifyToken(token)

    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true, isActive: true },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const path = (await params).path

    if (!path || path.length < 2) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 })
    }

    const folder = path[0]
    const filename = path.slice(1).join("/") // Handle nested paths

    // Construct file path
    const storageDir = process.env.STORAGE_DIR || join(process.cwd(), "storage")
    const filePath = join(storageDir, "protected", folder, filename)

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Additional access control based on folder/user role
    const hasAccess = checkFileAccess(folder, user.role, payload.id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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
      case "pdf":
        contentType = "application/pdf"
        break
    }

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Error serving protected image:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function checkFileAccess(
  folder: string,
  userRole: string,
  userId: string
): boolean {
  // Admin and superadmin can access all protected files
  if (userRole === "ADMIN" || userRole === "SUPERADMIN") {
    return true
  }

  // Define access rules for different folders
  switch (folder) {
    case "documents":
    case "contracts":
      // Only admins can access sensitive documents
      return false
    case "profile":
    case "kyc":
      // Users can access their own files (would need additional logic to check ownership)
      return true
    case "reports":
      // Only admins can access reports
      return false
    default:
      // Default: allow access for authenticated users
      return true
  }
}
