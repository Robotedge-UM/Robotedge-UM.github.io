import { SignupContent } from "@/components/pages/signup-content"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/landing-pages/settings`,
      {
        cache: "no-store",
      }
    )

    if (response.ok) {
      const settings = await response.json()
      return {
        title: `Join ${settings.companyName || "Robotedge"} - Sign Up`,
        description: `Join ${settings.companyName || "Robotedge"} and start building your network marketing business with our advanced binary tree structure and comprehensive package system.`,
      }
    }
  } catch (error) {
    console.error("Error fetching settings for signup metadata:", error)
  }

  return {
    title: "Join Robotedge - Sign Up",
    description:
      "Join Robotedge and start building your network marketing business with our advanced binary tree structure and comprehensive package system.",
  }
}

export default function SignupPage() {
  return <SignupContent />
}
