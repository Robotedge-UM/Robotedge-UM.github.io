"use client"

import { HomeSectionType } from "@prisma/client"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ResearchArea {
  id: string
  title: string
  description?: string
  imageUrl?: string
  order: number
}

interface ResearchData {
  title?: string
  content?: string
}

export function ResearchSection() {
  const [researchData, setResearchData] = useState<ResearchData>({
    title: "Research Areas",
    content: "Our research spans multiple domains in AI and robotics",
  })
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchResearchData()
    fetchResearchAreas()
  }, [])

  const fetchResearchData = async () => {
    try {
      const response = await fetch(
        `/api/home/sections?section=${HomeSectionType.RESEARCH_INTRO}`
      )
      if (response.ok) {
        const data = await response.json()
        setResearchData({
          title: data.title || researchData.title,
          content: data.content || researchData.content,
        })
      }
    } catch (error) {
      console.error("Error fetching research data:", error)
    }
  }

  const fetchResearchAreas = async () => {
    try {
      const response = await fetch("/api/home/research-areas")
      if (response.ok) {
        const data = await response.json()
        setResearchAreas(data)
      }
    } catch (error) {
      console.error("Error fetching research areas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      id="research"
      className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50"
      style={{
        backgroundImage: "url('/ResearchAreas/research_areas_bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Large faded background text positioned behind the title */}
        <div className="absolute z-0 pointer-events-none -top-2 md:-top-6 lg:-top-10">
          <div className="text-5xl font-bold leading-none text-gray-100 select-none md:text-7xl lg:text-8xl">
            {researchData.title}
          </div>
        </div>
        <div className="relative z-10 mb-16 text-start">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            {researchData.title}
          </h2>
        </div>

        {/* Research Areas Grid */}
        {!isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {researchAreas.map((area) => (
              <div
                key={area.id}
                className="overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:scale-105"
              >
                <div className="aspect-[4/3] relative">
                  {area.imageUrl ? (
                    <Image
                      src={area.imageUrl}
                      alt={area.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-teal-100">
                      <div className="text-center text-gray-500">
                        <div className="mb-2 text-4xl">🔬</div>
                        <p className="text-sm">{area.title}</p>
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="mb-2 text-xl font-medium leading-tight text-center text-white">
                      {area.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden bg-white shadow-lg rounded-2xl"
              >
                <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-4 mb-2 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
