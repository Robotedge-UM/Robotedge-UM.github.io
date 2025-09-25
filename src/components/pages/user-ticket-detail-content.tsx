"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  Role,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@prisma/client"
import { format, formatDistanceToNow } from "date-fns"
import {
  AlertCircle,
  ChevronLeft,
  Clock,
  FileUp,
  MessageCircle,
  Tag,
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
  attachments: string[]
  submitterId: string
  submitter: TicketUser
  assigneeId: string | null
  assignee: TicketUser | null
  initialResponseTime: string | null
  resolutionTime: string | null
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

export function UserTicketDetailContent({ ticketId }: { ticketId: string }) {
  const router = useRouter()

  // State
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [replyContent, setReplyContent] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Get suggested knowledge base articles
  const [suggestedArticles, setSuggestedArticles] = useState<any[]>([])

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

        // Get suggested knowledge base articles
        if (data) {
          try {
            const kbResponse = await fetch(
              `/api/support/knowledge?search=${encodeURIComponent(data.title)}`
            )
            if (kbResponse.ok) {
              const kbData = await kbResponse.json()
              setSuggestedArticles(kbData.articles.slice(0, 3))
            }
          } catch (error) {
            console.error("Error fetching knowledge base suggestions:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching ticket:", error)
        toast.error("Failed to load ticket details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTicket()
  }, [ticketId, toast])

  // Handle reply submission
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyContent.trim()) {
      toast("Please enter a reply before submitting")
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
          status: TicketStatus.OPEN, // Status updates after user replies
        }
      })

      // Clear form
      setReplyContent("")

      toast.success("Your reply has been submitted successfully")
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast.error("Failed to submit reply")
    } finally {
      setIsSending(false)
    }
  }

  // Handle close ticket
  const handleCloseTicket = async () => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: TicketStatus.CLOSED,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to close ticket")
      }

      setTicket((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          status: TicketStatus.CLOSED,
        }
      })

      toast.success("Your ticket has been closed successfully")
    } catch (error) {
      console.error("Error closing ticket:", error)
      toast.error("Failed to close the ticket")
    }
  }

  // Handle reopen ticket
  const handleReopenTicket = async () => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: TicketStatus.OPEN,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reopen ticket")
      }

      setTicket((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          status: TicketStatus.OPEN,
        }
      })

      toast("Your ticket has been reopened successfully")
    } catch (error) {
      console.error("Error reopening ticket:", error)
      toast("Failed to reopen the ticket")
    }
  }

  // View knowledge base article
  const viewKnowledgeArticle = (id: string) => {
    router.push(`/dashboard/support/knowledge/${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Ticket Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The requested ticket could not be found or you don't have permission
          to view it.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/dashboard/support")}
        >
          Return to Support
        </Button>
      </div>
    )
  }

  // Check if ticket is closed
  const isTicketClosed =
    ticket.status === TicketStatus.CLOSED ||
    ticket.status === TicketStatus.RESOLVED

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/support")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Support
        </Button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket and conversation - 2/3 width on desktop */}
        <div className="md:col-span-2 space-y-6">
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
              <div className="space-y-6">
                {/* Messages */}
                {ticket.replies && ticket.replies.length > 0 ? (
                  ticket.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="flex gap-4"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {reply.user.firstName?.[0] || reply.user.username[0]}
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
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(reply.createdAt), "PPp")}
                          </span>
                        </div>

                        <div className="mt-2 whitespace-pre-wrap">
                          {reply.content}
                        </div>

                        {/* Attachments */}
                        {reply.attachments && reply.attachments.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2 mt-1">
                              {reply.attachments.map((attachment, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                >
                                  <FileUp className="h-3 w-3 mr-1" />
                                  Attachment {index + 1}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No replies yet. Our support team will respond soon.
                  </div>
                )}

                {/* Reply form - only show if ticket is not closed */}
                {!isTicketClosed ? (
                  <form
                    onSubmit={handleSubmitReply}
                    className="mt-6 space-y-4"
                  >
                    <h3 className="text-lg font-medium">Your Reply</h3>
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
                ) : (
                  <div className="bg-muted p-4 rounded-md mt-6">
                    <p className="text-center">
                      This ticket is {ticket.status.toLowerCase()}.
                      {ticket.status === TicketStatus.CLOSED && (
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={handleReopenTicket}
                        >
                          Reopen ticket
                        </Button>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Ticket Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isTicketClosed ? (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleCloseTicket}
                >
                  Close Ticket
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleReopenTicket}
                >
                  Reopen Ticket
                </Button>
              )}

              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push("/dashboard/support/tickets/new")}
              >
                Create New Ticket
              </Button>
            </CardContent>
          </Card>

          {/* Ticket Information */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="mt-1">
                  <Badge className={statusBadgeColors[ticket.status]}>
                    {ticket.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Category</div>
                <div className="text-sm">
                  {ticket.category.replace(/_/g, " ")}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Priority</div>
                <div className="text-sm">{ticket.priority}</div>
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

              {ticket.initialResponseTime && (
                <div>
                  <div className="text-sm font-medium">Initial Response</div>
                  <div className="text-sm">
                    {format(new Date(ticket.initialResponseTime), "PPpp")}
                  </div>
                </div>
              )}

              {ticket.assignee && (
                <div>
                  <div className="text-sm font-medium">Assigned To</div>
                  <div className="text-sm">
                    {ticket.assignee.firstName} {ticket.assignee.lastName}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Articles */}
          {suggestedArticles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestedArticles.map((article) => (
                    <li key={article.id}>
                      <Button
                        variant="link"
                        className="text-left h-auto p-0"
                        onClick={() => viewKnowledgeArticle(article.id)}
                      >
                        {article.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
