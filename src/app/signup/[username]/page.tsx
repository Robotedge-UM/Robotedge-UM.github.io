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
        title: `Join Through Referral - ${settings.companyName || "Robotedge"}`,
        description: `Join ${settings.companyName || "Robotedge"} through a referral and get optimal binary tree placement. Start building your network marketing business today.`,
      }
    }
  } catch (error) {
    console.error(
      "Error fetching settings for referral signup metadata:",
      error
    )
  }

  return {
    title: "Join Through Referral - Robotedge",
    description:
      "Join Robotedge through a referral and get optimal binary tree placement. Start building your network marketing business today.",
  }
}

export default async function SignupWithReferralPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  return <SignupContent referralUsername={(await params).username} />
}
