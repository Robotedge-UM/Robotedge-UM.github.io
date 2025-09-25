"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { HomeSectionType } from "@prisma/client"

interface NewsEvent {
  id: string
  title: string
  content: string
  imageUrl?: string
  date: string
  featured: boolean
  order: number
}

interface NewsData {
  title?: string
  content?: string
}

export function NewsEventsSection() {
  const [newsData, setNewsData] = useState<NewsData>({
    title: "Highlights",
    content: "Latest news and achievements from our lab",
  })
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNewsData()
    fetchNewsEvents()
  }, [])

  useEffect(() => {
    if (newsEvents.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % newsEvents.length)
      }, 8000) // Auto-advance every 8 seconds

      return () => clearInterval(interval)
    }
  }, [newsEvents.length])

  const fetchNewsData = async () => {
    try {
      const response = await fetch(
        `/api/home/sections?section=${HomeSectionType.NEWS_EVENTS}`
      )
      if (response.ok) {
        const data = await response.json()
        setNewsData({
          title: data.title || newsData.title,
          content: data.content || newsData.content,
        })
      }
    } catch (error) {
      console.error("Error fetching news data:", error)
    }
  }

  const fetchNewsEvents = async () => {
    try {
      const response = await fetch("/api/home/news-events")
      if (response.ok) {
        const data = await response.json()
        setNewsEvents(data)
      }
    } catch (error) {
      console.error("Error fetching news events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsEvents.length)
  }

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + newsEvents.length) % newsEvents.length
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <section
      id="highlights"
      className="py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {newsData.title}
          </h2>
          <div className="w-16 h-1 bg-teal-500 mx-auto mb-6" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {newsData.content}
          </p>
        </div>

        {/* News Carousel */}
        {!isLoading && newsEvents.length > 0 ? (
          <div className="relative max-w-5xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-[500px] md:h-[600px]">
                {newsEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                      {/* Image Section */}
                      <div className="relative">
                        {event.imageUrl ? (
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                              <div className="text-6xl mb-4">📰</div>
                              <p>News Image</p>
                            </div>
                          </div>
                        )}

                        {/* Featured badge */}
                        {event.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="space-y-6">
                          <div className="text-teal-600 font-semibold text-sm uppercase tracking-wide">
                            {formatDate(event.date)}
                          </div>

                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            {event.title}
                          </h3>

                          <div className="prose prose-gray max-w-none">
                            <p className="text-gray-600 leading-relaxed">
                              {event.content.substring(0, 300)}
                              {event.content.length > 300 && "..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                {newsEvents.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 text-gray-800 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 z-10"
                      aria-label="Previous news"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 text-gray-800 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 z-10"
                      aria-label="Next news"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Pagination Dots */}
              {newsEvents.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {newsEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide
                          ? "bg-teal-500 scale-125"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Go to news ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-[500px] md:h-[600px]">
                <div className="bg-gray-200 animate-pulse" />
                <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No News Available
            </h3>
            <p className="text-gray-600">
              Stay tuned for exciting updates from our lab!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
