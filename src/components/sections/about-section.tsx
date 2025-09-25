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
      className="py-16 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                <div className="bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">🤖</div>
                    <p>About Image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-100 rounded-full opacity-50" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-100 rounded-full opacity-50" />
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {!isLoading ? (
              <>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {aboutData.title}
                  </h2>
                  <div className="w-12 h-1 bg-teal-500 mb-6" />
                </div>

                <div className="space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {aboutData.content}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() =>
                      document
                        .getElementById("research")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Know More
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-12 h-1 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
                <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
