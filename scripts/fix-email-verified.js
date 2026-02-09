/**
 * Fix emailVerified for all existing users in Supabase.
 *
 * Run this ONCE from your machine (not in Vercel):
 *   node scripts/fix-email-verified.js
 *
 * Requires DIRECT_URL in your .env.local (not the pooler URL).
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.user.updateMany({
    where: {
      emailVerified: null,
    },
    data: {
      emailVerified: new Date(),
    },
  })

  console.log(`✓ Updated ${result.count} user(s) — emailVerified is now set.`)
}

main()
  .catch((err) => {
    console.error('Error:', err.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
