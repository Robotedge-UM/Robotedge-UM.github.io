import { Metadata } from "next"
import { Navigation } from "@/components/navigation/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { ResearchSection } from "@/components/sections/research-section"
import { NewsEventsSection } from "@/components/sections/news-events-section"
import { Footer } from "@/components/layouts/footer"

export const metadata: Metadata = {
  title: "Robotedge - AI Robotics Lab | University of Malaya",
  description:
    "Robotedge AI Robotics Lab at University of Malaya. RoboCup champions in service robotics & humanoid soccer. Led by Dr. Zati Hakim Azizul Hasan.",
  keywords:
    "robotics, artificial intelligence, University of Malaya, RoboCup, humanoid soccer, service robotics, AI research, STEM education, robot competitions, Malaysia robotics",
  authors: [{ name: "Dr. Zati Hakim Azizul Hasan" }],
  robots: "index, follow",
  openGraph: {
    title: "Robotedge - AI Robotics Lab | University of Malaya",
    description:
      "Robotedge AI Robotics Lab at University of Malaya. RoboCup champions in service robotics & humanoid soccer. Led by Dr. Zati Hakim Azizul Hasan.",
    url: "https://robotedge-um.github.io/",
    siteName: "Robotedge",
    images: [
      {
        url: "/robotedge_logo_white_bg.png",
        width: 1200,
        height: 630,
        alt: "Robotedge AI Robotics Lab Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robotedge - AI Robotics Lab | University of Malaya",
    description:
      "AI Robotics Lab specializing in service robotics and humanoid soccer at University of Malaya. RoboCup champions advancing ethical robotics.",
    images: ["/robotedge_logo_white_bg.png"],
    site: "@robotedge_um",
    creator: "@robotedge_um",
  },
}

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ResearchSection />
        <NewsEventsSection />
      </main>
      <Footer />
    </>
  )
}
