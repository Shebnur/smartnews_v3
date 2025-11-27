#!/usr/bin/env node
/**
 * Test database connection and check if tables exist
 */

const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  try {
    console.log('🔍 Testing database connection...')
    console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))

    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Check if tables exist
    console.log('\n🔍 Checking for tables...')

    try {
      const userCount = await prisma.user.count()
      console.log(`✅ User table exists (${userCount} users)`)
    } catch (error) {
      console.log('❌ User table does NOT exist or is empty')
      console.log('Error:', error.message)
    }

    try {
      const profileCount = await prisma.userProfile.count()
      console.log(`✅ UserProfile table exists (${profileCount} profiles)`)
    } catch (error) {
      console.log('❌ UserProfile table does NOT exist')
    }

    try {
      const searchHistoryCount = await prisma.searchHistory.count()
      console.log(`✅ SearchHistory table exists (${searchHistoryCount} records)`)
    } catch (error) {
      console.log('❌ SearchHistory table does NOT exist')
    }

  } catch (error) {
    console.log('❌ Database connection FAILED!')
    console.log('Error:', error.message)
    console.log('\nFull error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
