import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.landingPageSettings.findFirst({
      where: { isActive: true },
      select: {
        companyName: true,
        companyLogo: true,
        contactEmail: true,
        contactPhone: true,
        supportEmail: true,
        contactAddress: true,
        facebookUrl: true,
        twitterUrl: true,
        linkedinUrl: true,
        instagramUrl: true,
        emailUrl: true,
        mapEmbedUrl: true,
        mapLatitude: true,
        mapLongitude: true,
      },
    })

    const footerData = settings || {
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
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5099.150140323086!2d101.64811987595519!3d3.128218753278943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49720ec81b9b%3A0x58d63e7d8749e9d8!2sFaculty%20of%20Computer%20Science%20and%20Information%20Technology!5e1!3m2!1sen!2smy!4v1758859786038!5m2!1sen!2smy",
      mapLatitude: 3.1319,
      mapLongitude: 101.6553,
    }

    return NextResponse.json({
      success: true,
      data: footerData,
    })
  } catch (error) {
    console.error("Error fetching footer data:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer data" },
      { status: 500 }
    )
  }
}
