"use client"

import { useState, useEffect } from "react"
import { HomeSectionType } from "@prisma/client"
import Image from "next/image"

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
      className="relative xl:min-h-[900px] overflow-hidden lg:flex items-center lg:pt-16 xl:pt-20"
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
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="w-full px-6 py-20 mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-12 gap-8 items-center min-h-[600px]">
            {/* Left Content - Text (centered and positioned better) */}
            <div className="flex flex-col justify-center col-span-12 space-y-6 lg:col-span-5">
              {!isLoading && (
                <>
                  {/* Main Title - Smaller size */}
                  <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl xl:text-5xl font-bold text-white tracking-tight">
                      <span className="block">
                        "BUILDING ROBOTS WITH EDGE –
                      </span>
                    </h1>
                  </div>

                  {/* EDGE Subtitle */}
                  <div className="space-y-1">
                    <h2 className="text-4xl font-bold leading-tighter tracking-wider md:text-5xl lg:text-5xl">
                      <span className="block text-teal-300">ETHICS.</span>
                      <span className="block text-teal-300">DIVERSITY.</span>
                      <span className="block text-teal-300">GREEN."</span>
                      <span className="block text-teal-300">ENGAGEMENT.</span>
                    </h2>
                  </div>

                  {/* Description */}
                  <div className="max-w-lg pt-2">
                    <p className="text-sm leading-relaxed md:text-base lg:text-lg text-white/95">
                      {heroData.content}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                    <button
                      onClick={() =>
                        document
                          .getElementById("research")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all duration-300 border rounded-full group bg-purple-600/80 backdrop-blur-sm border-purple-400/50 hover:bg-purple-500 hover:border-purple-300"
                    >
                      <Image
                        src="/icons/start_circle.svg"
                        alt="search icon"
                        width={24}
                        height={24}
                        className="text-base"
                      />
                      <span>Explore Research</span>
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById("news-events")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white transition-all duration-300 bg-transparent border rounded-full group border-white/60 hover:bg-white/10 hover:border-white"
                    >
                      <Image
                        src="/icons/octicon_play-24.svg"
                        alt="search icon"
                        width={24}
                        height={24}
                        className="text-base"
                      />
                      <span>View Achievements</span>
                    </button>
                  </div>
                </>
              )}

              {isLoading && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="h-12 rounded-lg bg-white/20 animate-pulse" />
                    <div className="h-12 rounded-lg bg-white/20 animate-pulse" />
                  </div>
                  <div className="h-8 rounded-lg bg-white/20 animate-pulse" />
                  <div className="h-16 rounded-lg bg-white/20 animate-pulse" />
                  <div className="flex gap-4">
                    <div className="w-32 h-10 rounded-lg bg-white/20 animate-pulse" />
                    <div className="w-32 h-10 rounded-lg bg-white/20 animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Empty to let background image (team photo) show through clearly */}
            <div className="relative hidden col-span-6 lg:block xl:col-span-7">
              {/* This space intentionally left for background image visibility */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
