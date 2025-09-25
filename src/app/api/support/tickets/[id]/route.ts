import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ActivityType, Role, SupportTier, TicketStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

// GET specific ticket
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

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        submitter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        replies: {
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
          // Only show internal notes to support staff
          where: user.role === Role.USER ? { isInternal: false } : undefined,
        },
        knowledgeBase: true,
      },
    })

    // Check if ticket exists
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

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error fetching support ticket:", error)
    return NextResponse.json(
      { error: "Failed to fetch support ticket" },
      { status: 500 }
    )
  }
}

// PATCH update ticket - for admins to handle assignment, escalation, status changes
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { status, assigneeId, tier, priority } = body

    // Validate the ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: { submitter: true },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Support ticket not found" },
        { status: 404 }
      )
    }

    // Regular users can only update their own tickets and only change status to OPEN or CLOSED
    if (user.role === Role.USER) {
      // Check if the user owns the ticket
      if (ticket.submitterId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      // Users can only update the status field
      if (assigneeId || tier || priority) {
        return NextResponse.json(
          { error: "You can only update the status of your ticket" },
          { status: 403 }
        )
      }

      // Users can only change status to OPEN or CLOSED
      if (
        status &&
        status !== TicketStatus.OPEN &&
        status !== TicketStatus.CLOSED
      ) {
        return NextResponse.json(
          { error: "You can only set status to OPEN or CLOSED" },
          { status: 403 }
        )
      }
    }
    // Support staff check remains for non-user roles
    else if (user.role !== Role.ADMIN && user.role !== Role.SUPERADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update data
    const updateData: any = {}

    if (status) updateData.status = status
    // Only allow staff to update these fields
    if (user.role !== Role.USER) {
      if (assigneeId) updateData.assigneeId = assigneeId
      if (tier) updateData.tier = tier
      if (priority) updateData.priority = priority
    }

    // Track response time if it hasn't been set yet
    if (!ticket.initialResponseTime && status === TicketStatus.IN_PROGRESS) {
      updateData.initialResponseTime = new Date()
    }

    // Track resolution time
    if (
      (status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED) &&
      !ticket.resolutionTime
    ) {
      updateData.resolutionTime = new Date()
    }

    // Update the ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: updateData,
    })

    // Create activity record for the ticket submitter
    let activityTitle = "Support Ticket Updated"
    let activityDescription = "Your support ticket has been updated"

    if (status === TicketStatus.IN_PROGRESS) {
      activityTitle = "Support Ticket In Progress"
      activityDescription = `Your ticket "${ticket.title}" is now being handled by support staff`
    } else if (status === TicketStatus.RESOLVED) {
      activityTitle = "Support Ticket Resolved"
      activityDescription = `Your ticket "${ticket.title}" has been marked as resolved`
    } else if (status === TicketStatus.ESCALATED) {
      let tierText = "higher level support"
      if (tier === SupportTier.TIER_2) tierText = "technical specialist"
      if (tier === SupportTier.TIER_3) tierText = "developer team"

      activityTitle = "Support Ticket Escalated"
      activityDescription = `Your ticket "${ticket.title}" has been escalated to ${tierText}`
    }

    await prisma.activity.create({
      data: {
        activityType: ActivityType.TICKET_UPDATED,
        title: activityTitle,
        description: activityDescription,
        userId: ticket.submitterId,
      },
    })

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error("Error updating support ticket:", error)
    return NextResponse.json(
      { error: "Failed to update support ticket" },
      { status: 500 }
    )
  }
}

// DELETE ticket (admins only)
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = await verifyToken(token)

    // Only superadmins can delete tickets
    if (!user || user.role !== Role.SUPERADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Validate the ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Support ticket not found" },
        { status: 404 }
      )
    }

    // Delete the ticket
    await prisma.supportTicket.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Support ticket deleted",
    })
  } catch (error) {
    console.error("Error deleting support ticket:", error)
    return NextResponse.json(
      { error: "Failed to delete support ticket" },
      { status: 500 }
    )
  }
}
