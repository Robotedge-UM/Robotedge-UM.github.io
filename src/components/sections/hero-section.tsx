"use client"

import { useState, useEffect } from "react"
import { HomeSectionType } from "@prisma/client"

interface HeroData {
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
}

export function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData>({
    title: "Building Robots with Edge –",
    subtitle: "Ethics. Diversity. Green. Engagement.",
    content:
      "Robotedge is the AI Robotics Lab of Universiti Malaya, led by Dr. Zati Hakim Azizul Hasan. We specialize in service robotics and integrating AI and robotics for competitions, research and industrial impact.",
    imageUrl:
      "/History/History_2025_World_Humanoid_Robot_Games_Group_Photo.jpg",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHeroData()
  }, [])

  const fetchHeroData = async () => {
    try {
      const response = await fetch(
        `/api/home/sections?section=${HomeSectionType.HERO}`
      )
      if (response.ok) {
        const data = await response.json()
        setHeroData({
          title: data.title || heroData.title,
          subtitle: data.subtitle || heroData.subtitle,
          content: data.content || heroData.content,
          imageUrl: data.imageUrl || heroData.imageUrl,
        })
      }
    } catch (error) {
      console.error("Error fetching hero data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-[800px] lg:min-h-[900px] overflow-hidden"
      style={{
        backgroundImage: `url(${heroData.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Partial overlay - only covers left side where text is, right side remains visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/75 via-45% to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent via-50% to-transparent"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-12 gap-8 items-center min-h-[600px]">
            {/* Left Content - Text (centered and positioned better) */}
            <div className="col-span-12 lg:col-span-6 xl:col-span-5 space-y-6 flex flex-col justify-center">
              {!isLoading && (
                <>
                  {/* Main Title - Smaller size */}
                  <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[0.9] tracking-tight">
                      <span className="block">"BUILDING ROBOTS</span>
                      <span className="block">WITH EDGE –</span>
                    </h1>
                  </div>

                  {/* EDGE Subtitle */}
                  <div className="space-y-1">
                    <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light leading-tight tracking-wider">
                      <span className="block text-teal-300">
                        ETHICS. DIVERSITY.
                      </span>
                      <span className="block text-teal-300">
                        GREEN. ENGAGEMENT."
                      </span>
                    </h2>
                  </div>

                  {/* Description */}
                  <div className="max-w-lg pt-2">
                    <p className="text-sm md:text-base lg:text-lg text-white/95 leading-relaxed">
                      {heroData.content}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() =>
                        document
                          .getElementById("research")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="group px-6 py-3 bg-purple-600/80 backdrop-blur-sm text-white border border-purple-400/50 rounded-full hover:bg-purple-500 hover:border-purple-300 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <span className="text-base">🔍</span>
                      <span>Explore Research</span>
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById("news-events")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="group px-6 py-3 bg-transparent text-white border border-white/60 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <span className="text-base">▶</span>
                      <span>View Achievements</span>
                    </button>
                  </div>
                </>
              )}

              {isLoading && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="h-12 bg-white/20 rounded-lg animate-pulse" />
                    <div className="h-12 bg-white/20 rounded-lg animate-pulse" />
                  </div>
                  <div className="h-8 bg-white/20 rounded-lg animate-pulse" />
                  <div className="h-16 bg-white/20 rounded-lg animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse" />
                    <div className="h-10 w-32 bg-white/20 rounded-lg animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Empty to let background image (team photo) show through clearly */}
            <div className="hidden lg:block col-span-6 xl:col-span-7 relative">
              {/* This space intentionally left for background image visibility */}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements matching the design */}
      <div className="absolute bottom-24 left-8 w-8 h-1 bg-teal-400"></div>
    </section>
  )
}
