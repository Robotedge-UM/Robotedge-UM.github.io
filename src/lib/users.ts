"use server"

import { prisma } from "./prisma"
import { Upline } from "./types"

export async function getReferrerId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referrerId: true },
  })

  return user?.referrerId || null
}

export async function getUser(userId: string): Promise<{
  id: string
  referrerId: string | null
  packageType: string | null
  totalEarnings: number
} | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      referrerId: true,
      totalEarnings: true,
      package: {
        select: {
          packageType: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    referrerId: user.referrerId,
    packageType: user.package?.packageType?.name || null,
    totalEarnings: user.totalEarnings,
  }
}

export async function getUplines(
  referrerId?: string | null
): Promise<Upline[]> {
  // Skip if no referrer ID
  if (!referrerId) {
    return []
  }

  try {
    const uplines: Upline[] = []

    // Get up to 4 levels of referrers
    let currentReferrerId = referrerId
    let levelCount = 0

    while (currentReferrerId && levelCount < 4) {
      try {
        // Get user details from the database
        const user = await prisma.user.findUnique({
          where: { id: currentReferrerId },
          select: {
            id: true,
            referrerId: true,
            totalEarnings: true,
            package: {
              select: {
                id: true,
                packageType: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        })

        // Break the loop if user not found
        if (!user) {
          break
        }

        // Add user to uplines if they have a package
        if (user.package?.packageType?.name) {
          const packageTypeName = user.package.packageType.name
          const totalEarnings = user.totalEarnings || 0

          // Get max milestone from database
          const packageConfig = await prisma.package.findUnique({
            where: { id: user.package.id },
            select: { maxMilestone: true },
          })

          const maxMilestone = packageConfig?.maxMilestone || 0

          // Only add users who haven't reached their milestone or are Kings
          if (packageTypeName === "KING" || totalEarnings < maxMilestone) {
            uplines.push({
              userId: user.id,
              level: levelCount + 1,
            })
          } else {
            console.log(
              `User ${user.id} has reached their milestone. Commission will be compressed upward.`
            )
            // For milestone-reached users, we skip them but continue with their upline
          }
        }

        // Move to the next referrer, or break if no more referrers
        if (!user.referrerId) {
          break
        }

        currentReferrerId = user.referrerId
        levelCount++
      } catch (error) {
        console.error(`Error fetching level ${levelCount + 1} referrer:`, error)
        break
      }
    }

    return uplines
  } catch (error) {
    console.error("Error fetching upline addresses:", error)
    return []
  }
}

export async function getAdminAddress(): Promise<{
  userId: string
} | null> {
  const admin = await prisma.user.findFirst({
    where: { role: "SUPERADMIN" },
    select: {
      id: true,
    },
  })

  if (!admin) {
    throw new Error("Admin not found")
  }

  return {
    userId: admin.id,
  }
}
