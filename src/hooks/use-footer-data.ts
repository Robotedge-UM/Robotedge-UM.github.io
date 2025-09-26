import { useState, useEffect } from "react"

interface FooterData {
  companyName: string
  companyLogo: string
  contactEmail: string
  contactPhone: string
  supportEmail: string
  contactAddress: string
  facebookUrl: string | null
  twitterUrl: string | null
  linkedinUrl: string | null
  instagramUrl: string | null
  emailUrl: string
  mapEmbedUrl: string | null
  mapLatitude: number
  mapLongitude: number
}

export function useFooterData() {
  const [footerData, setFooterData] = useState<FooterData>({
    companyName: "Robotedge",
    companyLogo: "/robotedge_logo_black_bg.png",
    contactEmail: "umrobotedge@gmail.com",
    contactPhone: "+60 3-7967 4000",
    supportEmail: "umrobotedge@gmail.com",
    contactAddress:
      "Faculty of Computer Science and Information Technology, Universiti Malaya, 50603 Kuala Lumpur, Malaysia",
    facebookUrl: "https://www.facebook.com/robotedge.um",
    twitterUrl: "https://twitter.com/robotedge_um",
    linkedinUrl: "https://www.linkedin.com/company/robotedge",
    instagramUrl: "https://www.instagram.com/robotedge.um",
    emailUrl: "mailto:umrobotedge@gmail.com",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.8158!2d101.6553!3d3.1319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e7d3%3A0x232e1ff540d86c99!2sUniversity%20of%20Malaya!5e0!3m2!1sen!2smy!4v1635000000000!5m2!1sen!2smy",
    mapLatitude: 3.1319,
    mapLongitude: 101.6553,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/footer")
        if (!response.ok) {
          throw new Error("Failed to fetch footer data")
        }
        const result = await response.json()
        if (result.success && result.data) {
          setFooterData(result.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        console.error("Error fetching footer data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  return { footerData, isLoading, error }
}
