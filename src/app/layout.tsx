import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

import { RootContent } from "@/components/layouts/root-content"
import { ThemeProvider } from "@/components/providers/dynamic-theme-provider"
import { Metadata } from "next"
import { Poppins } from "next/font/google"
import { ToastContainer } from "react-toastify"

export const metadata: Metadata = {
  title: "Robotedge - AI Robotics Lab | University of Malaya",
  description:
    "Robotedge AI Robotics Lab at University of Malaya. RoboCup champions in service robotics & humanoid soccer. Led by Dr. Zati Hakim Azizul Hasan.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "robotics",
    "artificial intelligence",
    "University of Malaya",
    "RoboCup",
    "humanoid soccer",
    "service robotics",
    "AI research",
    "STEM education",
    "robot competitions",
    "Malaysia robotics",
    "computer vision",
    "machine learning",
    "human-robot interaction",
  ],
  authors: [
    {
      name: "Dr. Zati Hakim Azizul Hasan",
    },
  ],
  creator: "Robotedge AI Robotics Lab",
  publisher: "University of Malaya",
  applicationName: "Robotedge Website",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": "-1",
    },
  },
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full"
    >
      <body
        className={`${poppins.className} h-full bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
          />
          <RootContent>{children}</RootContent>
        </ThemeProvider>
      </body>
    </html>
  )
}
