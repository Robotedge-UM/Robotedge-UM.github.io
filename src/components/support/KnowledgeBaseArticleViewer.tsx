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
import { Spinner } from "@/components/ui/spinner"
import { TicketCategory } from "@prisma/client"
import { ArrowLeft, Clock, Tag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Markdown from "react-markdown"
import { toast } from "react-toastify"
import remarkGfm from "remark-gfm"

interface KnowledgeBaseArticleViewerProps {
  articleId: string
}

interface Article {
  id: string
  title: string
  content: string
  category: TicketCategory
  tags: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
}

export function KnowledgeBaseArticleViewer({
  articleId,
}: KnowledgeBaseArticleViewerProps) {
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/support/knowledge/${articleId}`)
      if (!response.ok) throw new Error("Failed to fetch article")
      const data = await response.json()
      setArticle(data)

      // Fetch related articles based on category and tags
      const relatedResponse = await fetch(
        `/api/support/knowledge?category=${data.category}&limit=3&excludeId=${articleId}`
      )
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json()
        setRelatedArticles(relatedData.articles)
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      toast.error("Failed to load article")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!article) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Article not found
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl pt-8 mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Articles
      </Button>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <CardTitle className="text-3xl">{article.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">
                {article.category.replace(/_/g, " ")}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated {formatDate(article.updatedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {article.tags.join(", ")}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none">
          <Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown>
        </CardContent>
      </Card>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Articles</CardTitle>
            <CardDescription>
              Other articles that might help you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/dashboard/support/knowledge/${relatedArticle.id}`}
                  className="block"
                >
                  <div className="p-4 transition-colors border rounded-lg hover:bg-muted">
                    <h3 className="font-medium">{relatedArticle.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">
                        {relatedArticle.category.replace(/_/g, " ")}
                      </Badge>
                      {relatedArticle.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Need More Help Section */}
      <Card>
        <CardContent className="py-6">
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-medium">Still Need Help?</h3>
            <p className="text-muted-foreground">
              If this article didn't solve your problem, our support team is
              here to help.
            </p>
            <Button
              onClick={() => router.push("/dashboard/support/tickets/new")}
            >
              Create Support Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
