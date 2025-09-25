import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ActivityType, Role, TicketStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

// GET all replies for a ticket
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Check if ticket exists and user has permission to view it
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Support ticket not found" },
        { status: 404 }
      )
    }

    // Regular users can only see their own tickets
    if (user.role === Role.USER && ticket.submitterId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get replies
    const replies = await prisma.ticketReply.findMany({
      where: {
        ticketId: id,
        // Only show internal notes to support staff
        ...(user.role === Role.USER ? { isInternal: false } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(replies)
  } catch (error) {
    console.error("Error fetching ticket replies:", error)
    return NextResponse.json(
      { error: "Failed to fetch ticket replies" },
      { status: 500 }
    )
  }
}

// POST create new reply
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { content, attachments, isInternal } = body

    // Validation
    if (!content) {
      return NextResponse.json(
        { error: "Reply content is required" },
        { status: 400 }
      )
    }

    // Only support staff can create internal notes
    if (isInternal && user.role === Role.USER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Support ticket not found" },
        { status: 404 }
      )
    }

    // Regular users can only reply to their own tickets
    if (user.role === Role.USER && ticket.submitterId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create reply
    const reply = await prisma.ticketReply.create({
      data: {
        content,
        attachments: attachments || [],
        isInternal: isInternal || false,
        ticketId: id,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    })

    // Update ticket status based on who replied
    let newStatus = ticket.status
    if (user.role === Role.USER) {
      // If user replies to a resolved ticket, reopen it
      if (ticket.status === TicketStatus.RESOLVED) {
        newStatus = TicketStatus.OPEN
      }
      // If user replies to any other ticket, mark it as awaiting staff response
      else if (ticket.status !== TicketStatus.OPEN) {
        newStatus = TicketStatus.OPEN
      }
    } else if (user.role === Role.ADMIN || user.role === Role.SUPERADMIN) {
      // If admin replies, mark as awaiting user response
      if (!isInternal) {
        newStatus = TicketStatus.AWAITING_USER_RESPONSE

        // Set initial response time if it hasn't been set yet
        if (!ticket.initialResponseTime) {
          await prisma.supportTicket.update({
            where: { id },
            data: { initialResponseTime: new Date() },
          })
        }
      }
    }

    // Update ticket status and last updated time
    await prisma.supportTicket.update({
      where: { id },
      data: {
        status: newStatus,
        lastUpdated: new Date(),
      },
    })

    // Create notification for the other party
    const recipientId =
      user.role === Role.USER ? ticket.assigneeId || null : ticket.submitterId

    if (recipientId && !isInternal) {
      await prisma.activity.create({
        data: {
          activityType: ActivityType.TICKET_UPDATED,
          title: "New Reply to Support Ticket",
          description: `There's a new reply to ticket "${ticket.title}"`,
          userId: recipientId,
        },
      })
    }

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error("Error creating ticket reply:", error)
    return NextResponse.json(
      { error: "Failed to create ticket reply" },
      { status: 500 }
    )
  }
}
