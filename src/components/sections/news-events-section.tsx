"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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

interface CarouselSettings {
  autoScrollDelay?: number
  showNavigation?: boolean
  showPagination?: boolean
  infiniteScroll?: boolean
}

export function NewsEventsSection() {
  const [newsData, setNewsData] = useState<NewsData>({
    title: "Highlights",
    content: "Latest news and achievements from our lab",
  })
  const [carouselSettings, setCarouselSettings] = useState<CarouselSettings>({
    autoScrollDelay: 8000,
    showNavigation: true,
    showPagination: true,
    infiniteScroll: true,
  })
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  // Auto-scroll function with infinite loop support
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
    }

    if (carouselSettings.infiniteScroll && newsEvents.length > 1) {
      autoScrollRef.current = setInterval(() => {
        setIsTransitioning(true)
        setCurrentSlide((prev) => (prev + 1) % newsEvents.length)
      }, carouselSettings.autoScrollDelay || 8000)
    }
  }, [
    newsEvents.length,
    carouselSettings.autoScrollDelay,
    carouselSettings.infiniteScroll,
  ])

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }, [])

  useEffect(() => {
    fetchNewsData()
    fetchNewsEvents()
  }, [])

  useEffect(() => {
    startAutoScroll()
    return () => stopAutoScroll()
  }, [startAutoScroll, stopAutoScroll])

  // Handle transition end
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 500) // Match CSS transition duration

    return () => clearTimeout(timer)
  }, [currentSlide])

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
        // Fetch carousel settings
        setCarouselSettings({
          autoScrollDelay: data.autoScrollDelay || 8000,
          showNavigation: data.showNavigation !== false,
          showPagination: data.showPagination !== false,
          infiniteScroll: data.infiniteScroll !== false,
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

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    stopAutoScroll()
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % newsEvents.length)
    setTimeout(startAutoScroll, 1000) // Restart auto-scroll after manual navigation
  }, [isTransitioning, newsEvents.length, startAutoScroll, stopAutoScroll])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    stopAutoScroll()
    setIsTransitioning(true)
    setCurrentSlide(
      (prev) => (prev - 1 + newsEvents.length) % newsEvents.length
    )
    setTimeout(startAutoScroll, 1000) // Restart auto-scroll after manual navigation
  }, [isTransitioning, newsEvents.length, startAutoScroll, stopAutoScroll])

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return
      stopAutoScroll()
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTimeout(startAutoScroll, 1000) // Restart auto-scroll after manual navigation
    },
    [isTransitioning, currentSlide, startAutoScroll, stopAutoScroll]
  )

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    handleSwipe()
  }

  const handleSwipe = () => {
    const swipeThreshold = 50
    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
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
      className="py-16 bg-white md:py-24"
    >
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Large faded background text positioned behind the title */}
        <div className="absolute z-0 w-full text-center pointer-events-none -top-4 md:-top-8">
          <div className="text-6xl font-bold leading-none text-gray-100 select-none md:text-8xl">
            {newsData.title}
          </div>
        </div>
        {/* Section Header */}
        <div className="relative z-10 mb-12 text-center">
          <h2 className="mb-4 text-5xl font-bold text-gray-900 md:text-7xl">
            {newsData.title}
          </h2>
        </div>

        {/* Custom News Carousel */}
        {!isLoading && newsEvents.length > 0 ? (
          <div className="relative max-w-6xl mx-auto">
            <div
              className="relative overflow-hidden bg-white shadow-2xl rounded-3xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={stopAutoScroll}
              onMouseLeave={startAutoScroll}
            >
              <div className="relative h-[800px] md:h-[600px] lg:h-[600px]">
                {newsEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      index === currentSlide
                        ? "opacity-100 translate-x-0"
                        : index < currentSlide
                          ? "opacity-0 -translate-x-full"
                          : "opacity-0 translate-x-full"
                    }`}
                  >
                    <div className="grid items-center h-full grid-cols-1 gap-0 px-8 lg:grid-cols-5">
                      {/* Left Side - Image Container (Takes 1/3 on desktop) */}
                      <div className="relative lg:col-span-2 h-full lg:h-92">
                        <div className="relative h-full m-6 lg:mx-8 lg:my-0 overflow-hidden shadow-lg rounded-4xl">
                          {event.imageUrl ? (
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-700 hover:scale-105"
                              priority={index === 0}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-center text-gray-400">
                                <div className="mb-4 text-4xl lg:text-6xl">
                                  📰
                                </div>
                                <p className="text-sm lg:text-base">
                                  News Image
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Featured badge */}
                          {event.featured && (
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md bg-gradient-to-r from-yellow-400 to-orange-500">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Content (Takes 3/5 on desktop) */}
                      <div className="flex flex-col justify-center lg:col-span-3 lg:pr-12">
                        <div className="space-y-4 lg:space-y-6">
                          {/* Trophy Icon and Title */}
                          <div className="space-y-3 lg:space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold leading-tight text-gray-900 lg:text-2xl xl:text-3xl line-clamp-2">
                                  {event.title}
                                </h3>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="prose prose-gray max-w-none">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: event.content,
                              }}
                              className="text-sm leading-relaxed text-gray-600 lg:text-base"
                            ></p>
                          </div>

                          {/* Date positioned at bottom right */}
                          <div className="flex justify-end mt-6 lg:mt-8">
                            <div className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full lg:text-sm">
                              {formatDate(event.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                {carouselSettings.showNavigation && newsEvents.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      disabled={isTransitioning}
                      className="absolute z-10 p-2 text-gray-700 transition-all duration-200 transform -translate-y-1/2 border border-gray-200 rounded-full shadow-lg lg:p-3 bg-white/90 backdrop-blur-sm left-3 lg:left-4 top-1/2 hover:bg-white hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous news"
                    >
                      <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>

                    <button
                      onClick={nextSlide}
                      disabled={isTransitioning}
                      className="absolute z-10 p-2 text-gray-700 transition-all duration-200 transform -translate-y-1/2 border border-gray-200 rounded-full shadow-lg lg:p-3 bg-white/90 backdrop-blur-sm right-3 lg:right-4 top-1/2 hover:bg-white hover:shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next news"
                    >
                      <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Pagination Dots */}
              {carouselSettings.showPagination && newsEvents.length > 1 && (
                <div className="absolute flex space-x-2 transform -translate-x-1/2 lg:space-x-3 bottom-4 lg:bottom-6 left-1/2">
                  {newsEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      disabled={isTransitioning}
                      className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                        index === currentSlide
                          ? "bg-blue-600 scale-125 shadow-md"
                          : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                      }`}
                      aria-label={`Go to news ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : isLoading ? (
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden bg-white shadow-2xl rounded-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-5 h-[400px] md:h-[500px] lg:h-[600px]">
                {/* Image skeleton */}
                <div className="p-6 lg:col-span-3 lg:p-8">
                  <div className="h-full bg-gray-200 rounded-2xl animate-pulse" />
                </div>
                {/* Content skeleton */}
                <div className="flex flex-col justify-center p-6 space-y-4 lg:col-span-2 lg:p-8 lg:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full lg:w-10 lg:h-10 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-200 rounded lg:h-8 animate-pulse" />
                      <div className="w-3/4 h-6 bg-gray-200 rounded lg:h-8 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex justify-end">
                    <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative max-w-6xl mx-auto">
            <div className="p-12 text-center bg-white shadow-2xl rounded-3xl lg:p-16">
              <div className="mb-6 text-6xl lg:text-8xl">📰</div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 lg:text-3xl">
                No News Available
              </h3>
              <p className="max-w-md mx-auto text-lg text-gray-600">
                Stay tuned for exciting updates and achievements from our lab!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
