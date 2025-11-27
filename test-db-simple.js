#!/usr/bin/env node
/**
 * Simple database connection test using pg library
 */

const { Client } = require('pg')

async function testConnection() {
  // Test with URL encoding for special characters
  const passwords = [
    'SmartNews2024!Secure',           // Original
    'SmartNews2024%21Secure',         // With ! encoded as %21
  ]

  const connectionBase = 'postgresql://postgres.adkioyqnvnkikwntvggf:'
  const connectionEnd = '@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require'

  for (const password of passwords) {
    const connectionString = `${connectionBase}${password}${connectionEnd}`
    console.log(`\n🔍 Testing with password: ${password}`)
    console.log(`Connection: ${connectionString.replace(/:[^:@]+@/, ':****@')}`)

    const client = new Client({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false }
    })

    try {
      await client.connect()
      console.log('✅ Connection successful!')

      // Try to list tables
      const result = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `)

      if (result.rows.length > 0) {
        console.log('\n📊 Existing tables:')
        result.rows.forEach(row => console.log(`  - ${row.table_name}`))
      } else {
        console.log('\n⚠️  No tables found - schema needs to be pushed!')
      }

      await client.end()
      return true
    } catch (error) {
      console.log('❌ Connection failed!')
      console.log('Error:', error.message)
      await client.end().catch(() => {})
    }
  }

  return false
}

testConnection().then(success => {
  if (!success) {
    console.log('\n❌ All connection attempts failed!')
    console.log('\n💡 Troubleshooting:')
    console.log('1. Verify password in Supabase Dashboard → Settings → Database')
    console.log('2. Check if password was recently reset')
    console.log('3. Try copying connection string again from Supabase')
  }
  process.exit(success ? 0 : 1)
})
