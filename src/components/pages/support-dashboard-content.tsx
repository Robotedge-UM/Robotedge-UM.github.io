"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TicketCategory, TicketPriority, TicketStatus } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { useLandingPageSettings } from "@/lib/hooks/useLandingPageSettings"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  FileUp,
  Search,
  PlusCircle,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
} from "lucide-react"
import { toast } from "react-toastify"

// Define types
type Ticket = {
  id: string
  title: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  _count: { replies: number }
}

type KnowledgeBaseArticle = {
  id: string
  title: string
  category: TicketCategory
  tags: string[]
  createdAt: string
  viewCount: number
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

const categoryIcons = {
  [TicketCategory.ACCOUNT_ACCESS]: <AlertTriangle className="h-4 w-4" />,
  [TicketCategory.TRANSACTION_ISSUES]: <AlertTriangle className="h-4 w-4" />,
  [TicketCategory.PAYMENT_PROBLEMS]: <AlertTriangle className="h-4 w-4" />,
  [TicketCategory.COMMISSION_INQUIRIES]: <AlertTriangle className="h-4 w-4" />,
  [TicketCategory.REFERRAL_ISSUES]: <AlertTriangle className="h-4 w-4" />,
  [TicketCategory.SYSTEM_SUPPORT]: <AlertTriangle className="h-4 w-4" />,
  [TicketCategory.GENERAL_INQUIRIES]: <HelpCircle className="h-4 w-4" />,
}

export function SupportDashboardContent() {
  const router = useRouter()
  const { settings } = useLandingPageSettings()

  // State variables
  const [activeTab, setActiveTab] = useState("submit")
  const [isLoading, setIsLoading] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [knowledgeArticles, setKnowledgeArticles] = useState<
    KnowledgeBaseArticle[]
  >([])
  const [searchQuery, setSearchQuery] = useState("")

  // New ticket form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<TicketCategory | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestedArticles, setSuggestedArticles] = useState<
    KnowledgeBaseArticle[]
  >([])

  // Fetch user's tickets
  useEffect(() => {
    const fetchTickets = async () => {
      if (activeTab === "tickets") {
        setIsLoading(true)
        try {
          const response = await fetch("/api/support/tickets")
          if (!response.ok) {
            throw new Error("Failed to fetch tickets")
          }
          const data = await response.json()
          setTickets(data.tickets)
        } catch (error) {
          console.error("Error fetching tickets:", error)
          toast.error("Failed to load your support tickets")
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTickets()
  }, [activeTab])

  // Handle knowledge base search
  const fetchKnowledgeArticles = async () => {
    setIsLoading(true)
    try {
      let url = "/api/support/knowledge"
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch knowledge base")
      }

      const data = await response.json()
      setKnowledgeArticles(data.articles)
    } catch (error) {
      console.error("Error fetching knowledge base:", error)
      toast.error("Failed to load knowledge base")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-suggest knowledge base articles as user types ticket details
  useEffect(() => {
    const suggestArticles = async () => {
      if (title.length > 5) {
        try {
          const response = await fetch(
            `/api/support/knowledge?search=${encodeURIComponent(title)}`
          )
          if (response.ok) {
            const data = await response.json()
            setSuggestedArticles(data.articles.slice(0, 3))
          }
        } catch (error) {
          console.error("Error suggesting articles:", error)
          // Silently fail on suggestion errors
        }
      }
    }

    const debounceTimer = setTimeout(() => {
      suggestArticles()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [title])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!title.trim() || !description.trim() || !category) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit ticket")
      }

      const data = await response.json()

      toast.success("Your support ticket has been successfully submitted")

      // Reset form
      setTitle("")
      setDescription("")
      setCategory("")

      // Navigate to the ticket details
      router.push(`/dashboard/support/tickets/${data.ticket.id}`)
    } catch (error) {
      console.error("Error submitting ticket:", error)
      toast.error("Failed to submit your support ticket")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format the status display
  const getStatusBadge = (status: TicketStatus) => {
    return (
      <Badge className={statusBadgeColors[status]}>
        {status.replace(/_/g, " ")}
      </Badge>
    )
  }

  // Handle visiting a knowledge base article
  const viewKnowledgeArticle = (id: string) => {
    router.push(`/dashboard/support/knowledge/${id}`)
  }

  // Handle view ticket details
  const viewTicketDetails = (id: string) => {
    router.push(`/dashboard/support/tickets/${id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="text-muted-foreground">
          Get help with your {settings?.companyName || "Robotedge"} account and
          transactions
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="submit"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Submit Ticket</span>
          </TabsTrigger>
          <TabsTrigger
            value="tickets"
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>My Tickets</span>
          </TabsTrigger>
          <TabsTrigger
            value="knowledge"
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Knowledge Base</span>
          </TabsTrigger>
        </TabsList>

        {/* Submit Ticket Tab */}
        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Fill out the form below to create a new support ticket
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Knowledge base suggestions */}
              {suggestedArticles.length > 0 && (
                <div className="mb-6 bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">
                    Maybe these articles can help:
                  </h3>
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
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Ticket Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief summary of your issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value as TicketCategory)
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
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
                      <SelectItem value={TicketCategory.SYSTEM_SUPPORT}>
                        System Support
                      </SelectItem>
                      <SelectItem value={TicketCategory.GENERAL_INQUIRIES}>
                        General Inquiries
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide as much detail as possible about your issue"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <div>
                  <Label>Attachments (Optional)</Label>
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      You can attach screenshots or other relevant files to help
                      describe your issue.
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("knowledge")}
              >
                Browse Knowledge Base
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>Submit Ticket</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* My Tickets Tab */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>
                View and track your existing support tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any support tickets yet.
                  </p>
                  <Button onClick={() => setActiveTab("submit")}>
                    Create a New Ticket
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableCaption>Your support tickets</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Replies</TableHead>
                      <TableHead aria-label="Actions"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        onClick={() => viewTicketDetails(ticket.id)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {ticket.title}
                        </TableCell>
                        <TableCell>
                          {ticket.category.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(ticket.updatedAt), {
                            addSuffix: true,
                          })}
                        </TableCell>
                        <TableCell>{ticket._count.replies}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab("submit")}>
                Create a New Ticket
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Find answers to common questions and issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search knowledge base..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={fetchKnowledgeArticles}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.values(TicketCategory).map((cat) => (
                  <Card
                    key={cat}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSearchQuery(cat.replace(/_/g, " "))
                      fetchKnowledgeArticles()
                    }}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {categoryIcons[cat]}
                        {cat.replace(/_/g, " ")}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Articles */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : knowledgeArticles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No articles found. Try a different search term.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-medium">Articles</h3>
                  <div className="space-y-2">
                    {knowledgeArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => viewKnowledgeArticle(article.id)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">
                            {article.title}
                          </CardTitle>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <div>{article.category.replace(/_/g, " ")}</div>
                            <div>Views: {article.viewCount}</div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setActiveTab("submit")}
                >
                  Submit a ticket
                </Button>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
