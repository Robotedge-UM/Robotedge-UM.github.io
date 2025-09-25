import { prisma } from "@/lib/prisma"

async function main(): Promise<void> {
  console.log("\n=== MODULAR MLM SYSTEM READY FOR USE ===")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
