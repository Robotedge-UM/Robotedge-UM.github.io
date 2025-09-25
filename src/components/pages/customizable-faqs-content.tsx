"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

interface LandingPageSettings {
  companyName: string
  primaryColor: string
  secondaryColor: string
  supportEmail?: string
}

interface LandingPageContent {
  section: string
  title?: string
  subtitle?: string
  content?: string
}

export function CustomizableFaqsContent() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [settings, setSettings] = useState<LandingPageSettings | null>(null)
  const [contents, setContents] = useState<LandingPageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [faqsResponse, settingsResponse, contentsResponse] =
          await Promise.all([
            fetch("/api/faqs"),
            fetch("/api/landing-pages/settings"),
            fetch("/api/landing-pages/content?page=FAQS"),
          ])

        if (faqsResponse.ok) {
          const faqsData = await faqsResponse.json()
          setFaqs(faqsData)
        }

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData)
        }

        if (contentsResponse.ok) {
          const contentsData = await contentsResponse.json()
          setContents(contentsData)
        }
      } catch (error) {
        console.error("Error fetching FAQs data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Set CSS variables programmatically when settings change
  useEffect(() => {
    if (settings) {
      const primaryColor = settings.primaryColor || "#3B82F6"
      const secondaryColor = settings.secondaryColor || "#10B981"

      document.documentElement.style.setProperty(
        "--primary-color",
        primaryColor
      )
      document.documentElement.style.setProperty(
        "--secondary-color",
        secondaryColor
      )

      // Set additional color variations
      document.documentElement.style.setProperty(
        "--primary-rgb",
        hexToRgb(primaryColor)
      )
      document.documentElement.style.setProperty(
        "--secondary-rgb",
        hexToRgb(secondaryColor)
      )
    }
  }, [settings])

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "59, 130, 246" // fallback to blue
  }

  const getContentBySection = (section: string) => {
    return contents.find((content) => content.section === section)
  }

  const heroContent = getContentBySection("hero")

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ]

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group FAQs by category
  const groupedFaqs = filteredFaqs.reduce(
    (acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = []
      }
      acc[faq.category].push(faq)
      return acc
    },
    {} as Record<string, FAQ[]>
  )

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-24 bg-gradient-to-b"
        style={{
          background: `linear-gradient(to bottom, ${settings?.primaryColor || "#3B82F6"}0D, ${settings?.secondaryColor || "#10B981"}0D)`,
        }}
      >
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text mb-6">
              {heroContent?.title || "Frequently Asked Questions"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {heroContent?.subtitle ||
                `Find answers to common questions about ${settings?.companyName || "ModularMLM"}, our packages, bonus systems, and how to get started.`}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search for questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg bg-background/50 backdrop-blur-lg border-border/50"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "text-white"
                      : "hover:text-white"
                  }
                  style={{
                    backgroundColor:
                      selectedCategory === category
                        ? settings?.primaryColor || "#3B82F6"
                        : "transparent",
                    borderColor:
                      selectedCategory === category
                        ? settings?.primaryColor || "#3B82F6"
                        : `${settings?.primaryColor || "#3B82F6"}4D`,
                    color:
                      selectedCategory === category
                        ? "white"
                        : settings?.primaryColor || "#3B82F6",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.backgroundColor =
                        settings?.primaryColor || "#3B82F6"
                      e.currentTarget.style.color = "white"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color =
                        settings?.primaryColor || "#3B82F6"
                    }
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto max-w-4xl">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              {selectedCategory === "All" && (
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: settings?.primaryColor || "#3B82F6" }}
                >
                  {category}
                </h2>
              )}

              <div className="space-y-4">
                {categoryFaqs
                  .sort((a, b) => a.order - b.order)
                  .map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: true }}
                      className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-lg overflow-hidden transition-colors"
                      style={{
                        borderColor:
                          expandedFaq === faq.id
                            ? `${settings?.primaryColor || "#3B82F6"}4D`
                            : undefined,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${settings?.primaryColor || "#3B82F6"}4D`
                      }}
                      onMouseLeave={(e) => {
                        if (expandedFaq !== faq.id) {
                          e.currentTarget.style.borderColor = ""
                        }
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${settings?.primaryColor || "#3B82F6"}0D`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <h3 className="text-lg font-semibold pr-4">
                          {faq.question}
                        </h3>
                        {expandedFaq === faq.id ? (
                          <ChevronUp
                            className="w-5 h-5 flex-shrink-0"
                            style={{
                              color: settings?.primaryColor || "#3B82F6",
                            }}
                          />
                        ) : (
                          <ChevronDown
                            className="w-5 h-5 flex-shrink-0"
                            style={{
                              color: settings?.primaryColor || "#3B82F6",
                            }}
                          />
                        )}
                      </button>

                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4"
                        >
                          <div className="border-t border-border/50 pt-4">
                            <div
                              className="text-muted-foreground leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? "No results found" : "No FAQs available"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "Try adjusting your search terms or browse different categories."
                  : "FAQs are being prepared. Please check back later."}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                  }}
                  variant="outline"
                  className="hover:text-white"
                  style={{
                    borderColor: settings?.primaryColor || "#3B82F6",
                    color: settings?.primaryColor || "#3B82F6",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      settings?.primaryColor || "#3B82F6"
                    e.currentTarget.style.color = "white"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color =
                      settings?.primaryColor || "#3B82F6"
                  }}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="py-24"
        style={{
          background: `linear-gradient(to right, ${settings?.primaryColor || "#3B82F6"}, ${settings?.secondaryColor || "#10B981"})`,
        }}
      >
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to
              help you get started with {settings?.companyName || "ModularMLM"}.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {settings?.supportEmail && (
                <Link href={`mailto:${settings.supportEmail}`}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white hover:bg-gray-100"
                    style={{ color: settings?.primaryColor || "#3B82F6" }}
                  >
                    Contact Support
                  </Button>
                </Link>
              )}
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white"
                  style={{
                    borderColor: "white",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "white"
                    e.currentTarget.style.color =
                      settings?.primaryColor || "#3B82F6"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "white"
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
