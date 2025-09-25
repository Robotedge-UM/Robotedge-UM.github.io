"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Role,
  SupportTier,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@prisma/client"
import { format, formatDistanceToNow } from "date-fns"
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileUp,
  MessageCircle,
  Tag,
  UserCog,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

type TicketUser = {
  id: string
  username: string
  firstName: string | null
  lastName: string | null
  email: string
  role?: Role
}

type TicketReply = {
  id: string
  content: string
  attachments: string[]
  isInternal: boolean
  createdAt: string
  user: TicketUser
}

type Ticket = {
  id: string
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  tier: SupportTier
  attachments: string[]
  submitterId: string
  submitter: TicketUser
  assigneeId: string | null
  assignee: TicketUser | null
  initialResponseTime: string | null
  resolutionTime: string | null
  knowledgeBaseId: string | null
  knowledgeBase: any | null
  createdAt: string
  updatedAt: string
  replies: TicketReply[]
}

// Mapping for priority badges
const priorityBadgeColors = {
  [TicketPriority.CRITICAL]: "bg-red-500 hover:bg-red-600",
  [TicketPriority.HIGH]: "bg-orange-500 hover:bg-orange-600",
  [TicketPriority.MEDIUM]: "bg-yellow-500 hover:bg-yellow-600",
  [TicketPriority.LOW]: "bg-blue-500 hover:bg-blue-600",
}

// Mapping for status badges
const statusBadgeColors = {
  [TicketStatus.OPEN]: "bg-green-500 hover:bg-green-600",
  [TicketStatus.IN_PROGRESS]: "bg-blue-500 hover:bg-blue-600",
  [TicketStatus.AWAITING_USER_RESPONSE]: "bg-purple-500 hover:bg-purple-600",
  [TicketStatus.ESCALATED]: "bg-orange-500 hover:bg-orange-600",
  [TicketStatus.RESOLVED]: "bg-gray-500 hover:bg-gray-600",
  [TicketStatus.CLOSED]: "bg-gray-700 hover:bg-gray-800",
}

export function TicketDetailContent({ ticketId }: { ticketId: string }) {
  const router = useRouter()

  // State
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [supportStaff, setSupportStaff] = useState<TicketUser[]>([])

  // For ticket updates
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | null>(
    null
  )
  const [selectedPriority, setSelectedPriority] =
    useState<TicketPriority | null>(null)
  const [selectedTier, setSelectedTier] = useState<SupportTier | null>(null)
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | "ALL">(
    "ALL"
  )
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch ticket data
  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/support/tickets/${ticketId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch ticket")
        }
        const data = await response.json()
        setTicket(data)

        // Set form values from ticket data
        setSelectedStatus(data.status)
        setSelectedPriority(data.priority)
        setSelectedTier(data.tier)
        setSelectedAssigneeId(data.assigneeId || "ALL")
      } catch (error) {
        console.error("Error fetching ticket:", error)
        toast.error("Failed to load ticket details")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchSupportStaff = async () => {
      try {
        // This would need a new API endpoint to fetch admin/support users
        const response = await fetch("/api/users/support-staff")
        if (!response.ok) {
          throw new Error("Failed to fetch support staff")
        }
        const data = await response.json()
        setSupportStaff(data.users)
      } catch (error) {
        console.error("Error fetching support staff:", error)
        // Use empty array if endpoint doesn't exist yet
        setSupportStaff([])
      }
    }

    fetchTicket()
    fetchSupportStaff()
  }, [ticketId, toast])

  // Handle reply submission
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyContent.trim()) {
      toast.error("Please enter a reply before submitting")
      return
    }

    setIsSending(true)
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent,
          isInternal,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit reply")
      }

      const data = await response.json()

      // Update ticket with new reply
      setTicket((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          replies: [...prev.replies, data.reply],
          // Update status based on the reply
          status: data.reply.isInternal
            ? prev.status
            : TicketStatus.AWAITING_USER_RESPONSE,
        }
      })

      // Clear form
      setReplyContent("")
      setIsInternal(false)

      toast.success("Your reply has been submitted successfully")
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast.error("Failed to submit reply")
    } finally {
      setIsSending(false)
    }
  }

  // Handle ticket updates
  const updateTicket = async () => {
    setIsUpdating(true)
    try {
      const updates: any = {}

      if (selectedStatus !== null && selectedStatus !== ticket?.status) {
        updates.status = selectedStatus
      }

      if (selectedPriority !== null && selectedPriority !== ticket?.priority) {
        updates.priority = selectedPriority
      }

      if (selectedTier !== null && selectedTier !== ticket?.tier) {
        updates.tier = selectedTier
      }

      if (selectedAssigneeId !== ticket?.assigneeId) {
        updates.assigneeId =
          selectedAssigneeId === "ALL" ? null : selectedAssigneeId
      }

      // Only send request if there are changes
      if (Object.keys(updates).length === 0) {
        toast.warn("No changes were made to the ticket")
        return
      }

      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update ticket")
      }

      const data = await response.json()

      // Update ticket state with changes
      setTicket((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          ...updates,
          // If assigning, make sure we update the assignee object
          assignee:
            selectedAssigneeId !== prev.assigneeId
              ? supportStaff.find((s) => s.id === selectedAssigneeId) ||
                prev.assignee
              : prev.assignee,
        }
      })

      toast.success("The ticket has been updated successfully")
    } catch (error) {
      console.error("Error updating ticket:", error)
      toast.error("Failed to update the ticket")
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle creating KB article
  const createKnowledgeBase = () => {
    if (!ticket) return
    router.push(
      `/dashboard/support-admin/knowledge/new?fromTicket=${ticket.id}`
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Ticket Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The requested ticket could not be found.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/dashboard/support-admin")}
        >
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/support-admin")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main ticket content */}
        <div className="flex-1 space-y-6">
          {/* Ticket header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {ticket.category.replace(/_/g, " ")}
                    </Badge>
                    <Badge className={priorityBadgeColors[ticket.priority]}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {ticket.priority}
                    </Badge>
                    <Badge className={statusBadgeColors[ticket.status]}>
                      {ticket.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      Created{" "}
                      {formatDistanceToNow(new Date(ticket.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="mt-1">ID: {ticket.id}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-md p-4 whitespace-pre-wrap">
                {ticket.description}
              </div>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 font-medium">Attachments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {ticket.attachments.map((attachment, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                      >
                        <FileUp className="h-3 w-3 mr-2" />
                        Attachment {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation Thread */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Initial ticket as first message */}
              <div className="space-y-6">
                {/* Messages */}
                <div className="space-y-6">
                  {ticket.replies && ticket.replies.length > 0 ? (
                    ticket.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`flex gap-4 ${
                          reply.isInternal
                            ? "bg-yellow-50 dark:bg-yellow-950 p-4 rounded-md"
                            : ""
                        }`}
                      >
                        <Avatar>
                          <AvatarFallback>
                            {reply.user.firstName?.[0] ||
                              reply.user.username[0]}
                            {reply.user.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium">
                                {reply.user.firstName}{" "}
                                {reply.user.lastName || reply.user.username}
                              </span>
                              {reply.user.role !== Role.USER && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  Staff
                                </Badge>
                              )}
                              {reply.isInternal && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900"
                                >
                                  Internal Note
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(reply.createdAt), "PPp")}
                            </span>
                          </div>

                          <div className="mt-2 whitespace-pre-wrap">
                            {reply.content}
                          </div>

                          {/* Attachments */}
                          {reply.attachments &&
                            reply.attachments.length > 0 && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {reply.attachments.map(
                                    (attachment, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                      >
                                        <FileUp className="h-3 w-3 mr-1" />
                                        Attachment {index + 1}
                                      </Button>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No replies yet
                    </div>
                  )}
                </div>

                {/* Reply form */}
                <form
                  onSubmit={handleSubmitReply}
                  className="mt-6 space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Reply</h3>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="internal-note"
                        checked={isInternal}
                        onCheckedChange={setIsInternal}
                      />
                      <Label htmlFor="internal-note">Internal note</Label>
                    </div>
                  </div>

                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your reply here..."
                    className="min-h-[120px]"
                    disabled={isSending}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSending}
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      Attach Files
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSending}
                    >
                      {isSending ? (
                        <>
                          <Spinner className="mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>Send Reply</>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          {/* Ticket Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCog className="h-5 w-5 mr-2" />
                Ticket Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-status">Status</Label>
                <Select
                  value={selectedStatus || undefined}
                  onValueChange={(value) =>
                    setSelectedStatus(value as TicketStatus)
                  }
                >
                  <SelectTrigger id="ticket-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TicketStatus.OPEN}>Open</SelectItem>
                    <SelectItem value={TicketStatus.IN_PROGRESS}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={TicketStatus.AWAITING_USER_RESPONSE}>
                      Awaiting User Response
                    </SelectItem>
                    <SelectItem value={TicketStatus.ESCALATED}>
                      Escalated
                    </SelectItem>
                    <SelectItem value={TicketStatus.RESOLVED}>
                      Resolved
                    </SelectItem>
                    <SelectItem value={TicketStatus.CLOSED}>Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-priority">Priority</Label>
                <Select
                  value={selectedPriority || undefined}
                  onValueChange={(value) =>
                    setSelectedPriority(value as TicketPriority)
                  }
                >
                  <SelectTrigger id="ticket-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TicketPriority.CRITICAL}>
                      Critical
                    </SelectItem>
                    <SelectItem value={TicketPriority.HIGH}>High</SelectItem>
                    <SelectItem value={TicketPriority.MEDIUM}>
                      Medium
                    </SelectItem>
                    <SelectItem value={TicketPriority.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-tier">Support Tier</Label>
                <Select
                  value={selectedTier || undefined}
                  onValueChange={(value) =>
                    setSelectedTier(value as SupportTier)
                  }
                >
                  <SelectTrigger id="ticket-tier">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SupportTier.TIER_1}>
                      Tier 1 - Front-line Support
                    </SelectItem>
                    <SelectItem value={SupportTier.TIER_2}>
                      Tier 2 - Technical Specialist
                    </SelectItem>
                    <SelectItem value={SupportTier.TIER_3}>
                      Tier 3 - Developer Team
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-assignee">Assign To</Label>
                <Select
                  value={selectedAssigneeId}
                  onValueChange={(value) =>
                    setSelectedAssigneeId(value as string | "ALL")
                  }
                >
                  <SelectTrigger id="ticket-assignee">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Unassigned</SelectItem>
                    {supportStaff.map((staff) => (
                      <SelectItem
                        key={staff.id}
                        value={staff.id}
                      >
                        {staff.firstName} {staff.lastName || staff.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={updateTicket}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Spinner className="mr-2" />
                    Updating...
                  </>
                ) : (
                  <>Update Ticket</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Submitter</div>
                <div className="flex items-center mt-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>
                      {ticket.submitter.firstName?.[0] ||
                        ticket.submitter.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {ticket.submitter.firstName}{" "}
                    {ticket.submitter.lastName || ticket.submitter.username}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm">
                  {format(new Date(ticket.createdAt), "PPpp")}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Last Updated</div>
                <div className="text-sm">
                  {format(new Date(ticket.updatedAt), "PPpp")}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Initial Response</div>
                <div className="text-sm">
                  {ticket.initialResponseTime
                    ? format(new Date(ticket.initialResponseTime), "PPpp")
                    : "Not yet responded"}
                </div>
              </div>

              {ticket.resolutionTime && (
                <div>
                  <div className="text-sm font-medium">Resolution Time</div>
                  <div className="text-sm">
                    {format(new Date(ticket.resolutionTime), "PPpp")}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Knowledge Base Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.knowledgeBaseId ? (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>
                      This ticket has been added to the knowledge base
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/dashboard/support-admin/knowledge/${ticket.knowledgeBaseId}`
                      )
                    }
                  >
                    View Article
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={createKnowledgeBase}
                >
                  Create Knowledge Base Article
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
