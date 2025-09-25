"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { FileUp, Save, Eye, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import { HomeSectionType } from "@prisma/client"

interface HomeSection {
  id: string
  section: HomeSectionType
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
  order: number
  isActive: boolean
}

interface ResearchArea {
  id: string
  title: string
  description?: string
  imageUrl?: string
  order: number
  isActive: boolean
}

interface NewsEvent {
  id: string
  title: string
  content: string
  imageUrl?: string
  date: string
  featured: boolean
  order: number
  isActive: boolean
}

export function HomeContentEditor() {
  const [homeSections, setHomeSections] = useState<HomeSection[]>([])
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([])
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null)
  const [editingResearch, setEditingResearch] = useState<ResearchArea | null>(
    null
  )
  const [editingNews, setEditingNews] = useState<NewsEvent | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        fetchHomeSections(),
        fetchResearchAreas(),
        fetchNewsEvents(),
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchHomeSections = async () => {
    const response = await fetch("/api/home/sections")
    if (response.ok) {
      const data = await response.json()
      setHomeSections(data)
    }
  }

  const fetchResearchAreas = async () => {
    const response = await fetch("/api/home/research-areas")
    if (response.ok) {
      const data = await response.json()
      setResearchAreas(data)
    }
  }

  const fetchNewsEvents = async () => {
    const response = await fetch("/api/home/news-events")
    if (response.ok) {
      const data = await response.json()
      setNewsEvents(data)
    }
  }

  const handleFileUpload = async (file: File, section?: string) => {
    const formData = new FormData()
    formData.append("file", file)
    if (section) formData.append("section", section)

    try {
      const response = await fetch("/api/home/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("File uploaded successfully")
        return data.url
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Failed to upload file")
      return null
    }
  }

  const saveHomeSection = async (section: Partial<HomeSection>) => {
    try {
      const method = section.id ? "PUT" : "POST"
      const response = await fetch("/api/home/sections", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      })

      if (response.ok) {
        toast.success("Section saved successfully")
        fetchHomeSections()
        setEditingSection(null)
      } else {
        throw new Error("Save failed")
      }
    } catch (error) {
      console.error("Error saving section:", error)
      toast.error("Failed to save section")
    }
  }

  const saveResearchArea = async (area: Partial<ResearchArea>) => {
    try {
      const method = area.id ? "PUT" : "POST"
      const response = await fetch("/api/home/research-areas", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(area),
      })

      if (response.ok) {
        toast.success("Research area saved successfully")
        fetchResearchAreas()
        setEditingResearch(null)
      } else {
        throw new Error("Save failed")
      }
    } catch (error) {
      console.error("Error saving research area:", error)
      toast.error("Failed to save research area")
    }
  }

  const saveNewsEvent = async (event: Partial<NewsEvent>) => {
    try {
      const method = event.id ? "PUT" : "POST"
      const response = await fetch("/api/home/news-events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })

      if (response.ok) {
        toast.success("News event saved successfully")
        fetchNewsEvents()
        setEditingNews(null)
      } else {
        throw new Error("Save failed")
      }
    } catch (error) {
      console.error("Error saving news event:", error)
      toast.error("Failed to save news event")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Tabs
        defaultValue="sections"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Page Sections</TabsTrigger>
          <TabsTrigger value="research">Research Areas</TabsTrigger>
          <TabsTrigger value="news">News & Events</TabsTrigger>
        </TabsList>

        {/* Home Sections Tab */}
        <TabsContent
          value="sections"
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Page Sections</h2>
            <Button
              onClick={() => window.open("/", "_blank")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview Site
            </Button>
          </div>

          <div className="grid gap-6">
            {Object.values(HomeSectionType).map((sectionType) => {
              const section = homeSections.find(
                (s) => s.section === sectionType
              )
              return (
                <Card key={sectionType}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {sectionType.replace("_", " ")} Section
                      <Button
                        onClick={() =>
                          setEditingSection(
                            section ||
                              ({
                                id: "",
                                section: sectionType,
                                order: 0,
                                isActive: true,
                              } as HomeSection)
                          )
                        }
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {section
                        ? `Last updated: ${new Date(section.id).toLocaleDateString()}`
                        : "Not configured"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <strong>Title:</strong> {section?.title || "Not set"}
                      </p>
                      <p>
                        <strong>Subtitle:</strong>{" "}
                        {section?.subtitle || "Not set"}
                      </p>
                      <p>
                        <strong>Content:</strong>{" "}
                        {section?.content
                          ? `${section.content.substring(0, 100)}...`
                          : "Not set"}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {section?.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Research Areas Tab */}
        <TabsContent
          value="research"
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Research Areas</h2>
            <Button
              onClick={() =>
                setEditingResearch({
                  id: "",
                  title: "",
                  order: researchAreas.length,
                  isActive: true,
                } as ResearchArea)
              }
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Research Area
            </Button>
          </div>

          <div className="grid gap-4">
            {researchAreas.map((area) => (
              <Card key={area.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {area.title}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingResearch(area)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {area.description || "No description"}
                  </p>
                  {area.imageUrl && (
                    <img
                      src={area.imageUrl}
                      alt={area.title}
                      className="mt-2 h-20 w-20 object-cover rounded"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* News & Events Tab */}
        <TabsContent
          value="news"
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">News & Events</h2>
            <Button
              onClick={() =>
                setEditingNews({
                  id: "",
                  title: "",
                  content: "",
                  date: new Date().toISOString(),
                  featured: false,
                  order: newsEvents.length,
                  isActive: true,
                } as NewsEvent)
              }
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add News Event
            </Button>
          </div>

          <div className="grid gap-4">
            {newsEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {event.title}
                    <div className="flex gap-2">
                      {event.featured && (
                        <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <Button
                        onClick={() => setEditingNews(event)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {event.content.substring(0, 150)}...
                  </p>
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="mt-2 h-20 w-32 object-cover rounded"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Editing Modals would go here - simplified for now */}
      {(editingSection || editingResearch || editingNews) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingSection
                ? "Edit Section"
                : editingResearch
                  ? "Edit Research Area"
                  : "Edit News Event"}
            </h3>

            <div className="space-y-4">
              {/* Simple form - would need to be expanded */}
              <div>
                <Label>Title</Label>
                <Input
                  defaultValue={
                    editingSection?.title ||
                    editingResearch?.title ||
                    editingNews?.title ||
                    ""
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditingSection(null)
                    setEditingResearch(null)
                    setEditingNews(null)
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Component would go here */}
    </div>
  )
}
