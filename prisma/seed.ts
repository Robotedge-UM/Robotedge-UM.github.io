import { prisma } from "@/lib/prisma"
import { HomeSectionType } from "@prisma/client"

async function main(): Promise<void> {
  console.log("🌱 Seeding database...")

  // Seed Home Sections
  const heroSection = await prisma.homeSection.upsert({
    where: { section: HomeSectionType.HERO },
    update: {},
    create: {
      section: HomeSectionType.HERO,
      title: "Building Robots with Edge –",
      subtitle: "Ethics. Diversity. Green. Engagement.",
      content:
        "Robotedge is the AI Robotics Lab of Universiti Malaya, led by Dr. Zati Hakim Azizul Hasan. We specialize in service robotics and integrating AI and robotics for competitions, research and industrial impact.",
      order: 1,
    },
  })

  const aboutSection = await prisma.homeSection.upsert({
    where: { section: HomeSectionType.ABOUT },
    update: {},
    create: {
      section: HomeSectionType.ABOUT,
      title: "About Us",
      content:
        "Robotedge is the AI Robotics Lab of Universiti Malaya, bringing together students from Artificial Intelligence and Mechanical Engineering to explore the frontiers of service robotics. The lab was initiated by Dr Zati Hakim Azizul Hasan, whose leadership has been instrumental to its growth and development.",
      order: 2,
    },
  })

  const researchSection = await prisma.homeSection.upsert({
    where: { section: HomeSectionType.RESEARCH_INTRO },
    update: {},
    create: {
      section: HomeSectionType.RESEARCH_INTRO,
      title: "Research Areas",
      content: "Our research spans multiple domains in AI and robotics",
      order: 3,
    },
  })

  const newsSection = await prisma.homeSection.upsert({
    where: { section: HomeSectionType.NEWS_EVENTS },
    update: {},
    create: {
      section: HomeSectionType.NEWS_EVENTS,
      title: "Highlights",
      content: "Latest news and achievements from our lab",
      order: 4,
    },
  })

  // Seed Research Areas
  const researchAreas = [
    {
      title: "Path Planning",
      description:
        "Advanced algorithms for robot navigation and path optimization",
      order: 1,
    },
    {
      title: "Search and Rescue",
      description: "Robotic systems for emergency response and disaster relief",
      order: 2,
    },
    {
      title: "Healthcare",
      description: "Medical robotics and assistive technologies",
      order: 3,
    },
    {
      title: "Social & Service",
      description:
        "Robots designed to interact with and assist humans in daily life",
      order: 4,
    },
    {
      title: "Water & Environmental",
      description: "Environmental monitoring and aquatic robotics systems",
      order: 5,
    },
    {
      title: "Perception (Fundamental vision + Machine Learning)",
      description: "Computer vision and AI systems for robot perception",
      order: 6,
    },
  ]

  for (const area of researchAreas) {
    await prisma.researchArea.upsert({
      where: { id: `research-area-${area.order}` },
      update: {},
      create: {
        id: `research-area-${area.order}`,
        ...area,
      },
    })
  }

  // Seed News & Events
  await prisma.newsEvent.upsert({
    where: { id: "news-robocup-2025" },
    update: {},
    create: {
      id: "news-robocup-2025",
      title:
        "🏆 First Place at RoboCup Malaysia @Home // Beijing Here We Come!",
      content:
        "August was a hectic but rewarding month for Robotedge. At RoboCup Malaysia 2025 in Perlis, our team proudly secured First Place in the @Home Category, solidifying our position as one of Malaysia's leading robotics teams.<br><br>Building on this success, we're thrilled to announce that Robotedge has been invited to the World Humanoid Robot Games 2025 in Beijing! This marks the beginning of our exciting journey into humanoid soccer competitions, expanding our focus beyond service robotics and into a whole new arena.",
      date: new Date("2025-08-23"),
      featured: true,
      order: 1,
    },
  })

  await prisma.newsEvent.upsert({
    where: { id: "news-robocup-2024" },
    update: {},
    create: {
      id: "news-robocup-2024",
      title: "🤖 Robotedge Shines at RoboCup 2024 in Bordeaux, France!",
      content:
        "In July 2024, Robotedge made a significant mark on the international stage at RoboCup 2024 in Bordeaux, France. Our team showcased exceptional skills and innovation, earning us a commendable Third Place in the @Home Category. This achievement not only highlights our dedication to advancing service robotics but also cements our status as one of Malaysia's premier robotics teams.\n\nWe extend our heartfelt congratulations to all team members whose hard work and passion drove us to this success. As we celebrate this milestone, we remain committed to pushing the boundaries of robotics research and innovation.",
      date: new Date("2024-07-15"),
      featured: false,
      order: 2,
    },
  })

  await prisma.newsEvent.upsert({
    where: { id: "news-robocup-2023" },
    update: {},
    create: {
      id: "news-robocup-2023",
      title: "🤖 Robotedge Triumphs at RoboCup 2023 in Bordeaux, France!",
      content:
        "In July 2023, Robotedge proudly represented Malaysia at RoboCup 2023 in Bordeaux, France, where we achieved an impressive Second Place in the @Home Category. This accomplishment underscores our team's dedication to excellence in service robotics and highlights our position as one of Malaysia's leading robotics teams.\n\nWe extend our heartfelt congratulations to all team members whose hard work and passion drove us to this success. As we celebrate this milestone, we remain committed to pushing the boundaries of robotics research and innovation.",
      date: new Date("2023-07-20"),
      featured: false,
      order: 3,
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log(
    `Created sections: ${
      [heroSection, aboutSection, researchSection, newsSection].length
    }`
  )
  console.log(`Created research areas: ${researchAreas.length}`)
  console.log(`Created news events: 3`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
