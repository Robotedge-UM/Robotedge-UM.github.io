"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Search, Plus, Eye, Edit, Trash } from "lucide-react"
import { TicketCategory } from "@prisma/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type KnowledgeBaseArticle = {
  id: string
  title: string
  category: TicketCategory
  tags: string[]
  isPublished: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export function KnowledgeBaseContent() {
  const router = useRouter()
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "ALL">(
    "ALL"
  )

  useEffect(() => {
    fetchArticles()
  }, [categoryFilter])

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      let url = "/api/support/knowledge-base"
      if (categoryFilter !== "ALL") {
        url += `?category=${categoryFilter}`
      }
      const response = await fetch(url)
      const data = await response.json()
      setArticles(data.articles)
    } catch (error) {
      console.error("Error fetching knowledge base articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchArticles()
  }

  const handleCreateArticle = () => {
    router.push("/dashboard/support-admin/knowledge/new")
  }

  const handleEditArticle = (id: string) => {
    router.push(`/dashboard/support-admin/knowledge/${id}`)
  }

  const handleViewArticle = (id: string) => {
    router.push(`/dashboard/support-admin/knowledge/${id}`)
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      await fetch(`/api/support/knowledge-base/${id}`, {
        method: "DELETE",
      })
      fetchArticles() // Refresh the list
    } catch (error) {
      console.error("Error deleting article:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Knowledge Base Management</CardTitle>
            <CardDescription>
              Create and manage knowledge base articles for common support
              issues
            </CardDescription>
          </div>
          <Button onClick={handleCreateArticle}>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end mb-6">
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
                className="w-[200px]"
              >
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {Object.values(TicketCategory).map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                  >
                    {category.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form
            className="flex gap-2"
            onSubmit={handleSearch}
          >
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px]"
            />
            <Button
              type="submit"
              size="icon"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Articles Table */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableCaption>List of knowledge base articles</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center"
                  >
                    No articles found
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell>{article.category.replace(/_/g, " ")}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={article.isPublished ? "default" : "secondary"}
                      >
                        {article.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {article.viewCount}
                    </TableCell>
                    <TableCell>
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewArticle(article.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditArticle(article.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
