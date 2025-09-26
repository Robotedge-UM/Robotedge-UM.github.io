"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { HomeSectionType } from "@prisma/client"

interface AboutData {
  title?: string
  content?: string
  imageUrl?: string
}

export function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: "About Us",
    content:
      "Robotedge is the AI Robotics Lab of Universiti Malaya, bringing together students from Artificial Intelligence and Mechanical Engineering to explore the frontiers of service robotics. The lab was initiated by Dr Zati Hakim Azizul Hasan, whose leadership has been instrumental to its growth and development.",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const response = await fetch(
        `/api/home/sections?section=${HomeSectionType.ABOUT}`
      )
      if (response.ok) {
        const data = await response.json()
        setAboutData({
          title: data.title || aboutData.title,
          content: data.content || aboutData.content,
          imageUrl: data.imageUrl,
        })
      }
    } catch (error) {
      console.error("Error fetching about data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      id="about"
      className="relative py-16 overflow-hidden bg-white md:py-24"
    >
      <div className="relative px-6 mx-auto max-w-7xl lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Section */}
          <div className="relative">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-xl">
              {aboutData.imageUrl ? (
                <Image
                  src={aboutData.imageUrl}
                  alt="About Robotedge"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-teal-50">
                  <div className="text-center text-gray-400">
                    <div className="mb-4 text-6xl">🤖</div>
                    <p>About Image</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="relative space-y-8">
            {!isLoading ? (
              <>
                {/* Large faded background text positioned behind the title */}
                <div className="absolute z-0 pointer-events-none -top-6 lg:-top-8">
                  <div className="font-bold leading-none text-gray-100 select-none text-7xl lg:text-8xl ">
                    {aboutData.title}
                  </div>
                </div>
                <div className="relative z-10 space-y-6">
                  <h2 className="relative z-10 mb-8 text-5xl font-bold text-gray-900 lg:text-6xl">
                    {aboutData.title}
                  </h2>

                  <div className="space-y-6">
                    <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                      {aboutData.content}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        document
                          .getElementById("research")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Know More
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="w-2/3 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
