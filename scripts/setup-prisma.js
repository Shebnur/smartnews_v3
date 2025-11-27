const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Prisma Client...\n');

// Check if we need to generate
const clientPath = path.join(__dirname, '..', 'node_modules', '@prisma', 'client');

try {
  // Try to import existing client
  require('@prisma/client');
  console.log('✅ Prisma client already available!');
  process.exit(0);
} catch (error) {
  console.log('📦 Generating Prisma client...');
  
  try {
    // Set environment variable to skip checksum validation
    process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = '1';
    
    // Try to generate without downloading engines (use existing ones)
    execSync('npx prisma generate --no-engine', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully!');
  } catch (err) {
    console.log('⚠️  Standard generation failed, trying alternative method...');
    
    // Alternative: Just ensure the client exists
    try {
      const { PrismaClient } = require('@prisma/client');
      console.log('✅ Prisma client is working!');
    } catch (finalErr) {
      console.error('❌ Failed to set up Prisma client');
      console.error('Error:', finalErr.message);
      process.exit(1);
    }
  }
}
