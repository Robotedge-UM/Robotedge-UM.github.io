"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SupportTier,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { ChevronRight, Clock, Search, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { KnowledgeBaseContent } from "../support/KnowledgeBaseContent"
import { SupportSettingsContent } from "../support/SupportSettingsContent"

// Define ticket types
type TicketUser = {
  id: string
  username: string
  firstName: string | null
  lastName: string | null
  email: string
}

type Ticket = {
  id: string
  title: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  tier: SupportTier
  createdAt: string
  updatedAt: string
  submitter: TicketUser
  assignee: TicketUser | null
  _count: { replies: number }
}

type TicketResponse = {
  tickets: Ticket[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
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

// Support ticket stats
type TicketStats = {
  total: number
  open: number
  inProgress: number
  awaitingResponse: number
  escalated: number
  resolved: number
  avgResponseTime: number
  avgResolutionTime: number
}

export function SupportAdminContent() {
  const router = useRouter()

  // State variables
  const [activeTab, setActiveTab] = useState("queue")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    awaitingResponse: 0,
    escalated: 0,
    resolved: 0,
    avgResponseTime: 0,
    avgResolutionTime: 0,
  })

  // Filter states
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "ALL">(
    "ALL"
  )
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "ALL">(
    "ALL"
  )
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch tickets from API
  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      let url = `/api/support/tickets?page=${pagination.page}&limit=${pagination.limit}`

      // Add filters if they exist
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`
      if (priorityFilter !== "ALL") url += `&priority=${priorityFilter}`
      if (categoryFilter !== "ALL") url += `&category=${categoryFilter}`

      const response = await fetch(url)
      const data: TicketResponse = await response.json()

      setTickets(data.tickets)
      setPagination(data.pagination)

      // Calculate stats
      const stats: TicketStats = {
        total: data.pagination.total,
        open: data.tickets.filter((t) => t.status === TicketStatus.OPEN).length,
        inProgress: data.tickets.filter(
          (t) => t.status === TicketStatus.IN_PROGRESS
        ).length,
        awaitingResponse: data.tickets.filter(
          (t) => t.status === TicketStatus.AWAITING_USER_RESPONSE
        ).length,
        escalated: data.tickets.filter(
          (t) => t.status === TicketStatus.ESCALATED
        ).length,
        resolved: data.tickets.filter(
          (t) =>
            t.status === TicketStatus.RESOLVED ||
            t.status === TicketStatus.CLOSED
        ).length,
        avgResponseTime: 0, // Would need backend support to calculate these
        avgResolutionTime: 0,
      }
      setStats(stats)
    } catch (error) {
      console.error("Error fetching tickets:", error)
      toast.error("Failed to fetch tickets. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchTickets()
  }, [pagination.page, statusFilter, priorityFilter, categoryFilter])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTickets()
  }

  // Navigate to ticket details
  const handleTicketClick = (id: string) => {
    router.push(`/dashboard/support-admin/tickets/${id}`)
  }

  // Get badge component based on priority
  const getPriorityBadge = (priority: TicketPriority) => {
    return <Badge className={priorityBadgeColors[priority]}>{priority}</Badge>
  }

  // Get badge component based on status
  const getStatusBadge = (status: TicketStatus) => {
    return (
      <Badge className={statusBadgeColors[status]}>
        {status.replace(/_/g, " ")}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Support Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage support tickets and knowledge base articles
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              router.push("/dashboard/support-admin/knowledge/new")
            }
          >
            Create Knowledge Base Article
          </Button>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All tickets in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
              />
              <path d="M9 12h6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <p className="text-xs text-muted-foreground">
              Tickets needing attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Currently being worked on
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgResponseTime > 0 ? `${stats.avgResponseTime}h` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="queue">Ticket Queue</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Ticket Queue Tab */}
        <TabsContent
          value="queue"
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Support Ticket Queue</CardTitle>
              <CardDescription>
                Manage and respond to customer support tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as TicketStatus | "ALL")
                    }
                  >
                    <SelectTrigger
                      id="status"
                      className="w-[180px]"
                    >
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value={TicketStatus.OPEN}>Open</SelectItem>
                      <SelectItem value={TicketStatus.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={TicketStatus.AWAITING_USER_RESPONSE}>
                        Awaiting Response
                      </SelectItem>
                      <SelectItem value={TicketStatus.ESCALATED}>
                        Escalated
                      </SelectItem>
                      <SelectItem value={TicketStatus.RESOLVED}>
                        Resolved
                      </SelectItem>
                      <SelectItem value={TicketStatus.CLOSED}>
                        Closed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={priorityFilter}
                    onValueChange={(value) =>
                      setPriorityFilter(value as TicketPriority | "ALL")
                    }
                  >
                    <SelectTrigger
                      id="priority"
                      className="w-[180px]"
                    >
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Priorities</SelectItem>
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
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) =>
                      setCategoryFilter(value as TicketCategory | "ALL")
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className="w-[180px]"
                    >
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Categories</SelectItem>
                      <SelectItem value={TicketCategory.ACCOUNT_ACCESS}>
                        Account Access
                      </SelectItem>
                      <SelectItem value={TicketCategory.TRANSACTION_ISSUES}>
                        Transaction Issues
                      </SelectItem>
                      <SelectItem value={TicketCategory.PAYMENT_PROBLEMS}>
                        Payment Problems
                      </SelectItem>
                      <SelectItem value={TicketCategory.COMMISSION_INQUIRIES}>
                        Commission Inquiries
                      </SelectItem>
                      <SelectItem value={TicketCategory.REFERRAL_ISSUES}>
                        Referral Issues
                      </SelectItem>
                      <SelectItem value={TicketCategory.GENERAL_INQUIRIES}>
                        General Inquiries
                      </SelectItem>
                      <SelectItem value={TicketCategory.GENERAL_INQUIRIES}>
                        General Inquiries
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <form
                  className="flex gap-2"
                  onSubmit={handleSearch}
                >
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[250px]"
                  />
                  <Button
                    type="submit"
                    size="icon"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Tickets Table */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : (
                <Table>
                  <TableCaption>List of support tickets</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center"
                        >
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          onClick={() => handleTicketClick(ticket.id)}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {ticket.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>
                            {ticket.category.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(ticket.priority)}
                          </TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell>{ticket.submitter.username}</TableCell>
                          <TableCell>
                            {ticket.assignee
                              ? ticket.assignee.username
                              : "Unassigned"}
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(ticket.createdAt), {
                              addSuffix: true,
                            })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <div className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent
          value="knowledge"
          className="space-y-4"
        >
          <KnowledgeBaseContent />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent
          value="settings"
          className="space-y-4"
        >
          <SupportSettingsContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}
