"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { HomeSectionType } from "@prisma/client"

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
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {researchData.title}
          </h2>
          <div className="w-16 h-1 bg-teal-500 mx-auto mb-6" />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {researchData.content}
          </p>
        </div>

        {/* Research Areas Grid */}
        {!isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {researchAreas.map((area) => (
              <div
                key={area.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">🔬</div>
                        <p className="text-sm">{area.title}</p>
                      </div>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                      {area.title}
                    </h3>
                  </div>
                </div>

                {area.description && (
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
