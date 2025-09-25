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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, X, Plus } from "lucide-react"
import { TicketCategory } from "@prisma/client"
import { toast } from "react-toastify"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface KnowledgeBaseEditorProps {
  articleId?: string
}

export function KnowledgeBaseEditor({ articleId }: KnowledgeBaseEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [article, setArticle] = useState({
    title: "",
    content: "",
    category: "" as TicketCategory,
    tags: [] as string[],
    isPublished: false,
  })
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (articleId) {
      fetchArticle()
    } else {
      setIsLoading(false)
    }
  }, [articleId])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/support/knowledge-base/${articleId}`)
      if (!response.ok) throw new Error("Failed to fetch article")
      const data = await response.json()
      setArticle(data)
    } catch (error) {
      console.error("Error fetching article:", error)
      toast.error("Failed to load article")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!article.title || !article.content || !article.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    try {
      const url = articleId
        ? `/api/support/knowledge-base/${articleId}`
        : "/api/support/knowledge-base"
      const method = articleId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      })

      if (!response.ok) throw new Error("Failed to save article")

      toast.success("Article saved successfully")
      router.push("/dashboard/support-admin")
    } catch (error) {
      console.error("Error saving article:", error)
      toast.error("Failed to save article")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag && !article.tags.includes(newTag)) {
      setArticle({
        ...article,
        tags: [...article.tags, newTag],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setArticle({
      ...article,
      tags: article.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="pt-8 space-y-6 px-2 lg:px-8">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {articleId ? "Edit Knowledge Base Article" : "Create New Article"}
          </CardTitle>
          <CardDescription>
            Create or edit an article for the knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={article.title}
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
              placeholder="Article title"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={article.category}
              onValueChange={(value) =>
                setArticle({ ...article, category: value as TicketCategory })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
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

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {article.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <form
              onSubmit={handleAddTag}
              className="flex gap-2"
            >
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
              />
              <Button
                type="submit"
                size="icon"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={article.content}
              onChange={(e) =>
                setArticle({ ...article, content: e.target.value })
              }
              placeholder="Article content (supports Markdown)"
              className="min-h-[300px]"
            />
          </div>

          {/* Publish Status */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="published">Publish Article</Label>
            <Switch
              id="published"
              checked={article.isPublished}
              onCheckedChange={(checked) =>
                setArticle({ ...article, isPublished: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
