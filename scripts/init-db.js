#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Initializing database...\n');

// Check if Prisma CLI is available
try {
  execSync('npx prisma --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Prisma CLI not found. Please run: npm install');
  process.exit(1);
}

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Creating from template...\n');

  const envExample = path.join(process.cwd(), '.env.example');
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envPath);
    console.log('✅ Created .env file\n');
  } else {
    // Create minimal .env
    fs.writeFileSync(envPath, 'DATABASE_URL="file:./dev.db"\nNEXTAUTH_SECRET="development-secret-change-in-production"\n');
    console.log('✅ Created minimal .env file\n');
  }
}

try {
  console.log('📋 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated\n');

  console.log('🔨 Creating database schema...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  console.log('✅ Database schema created\n');

  console.log('🎉 Database initialization complete!\n');
  console.log('You can now:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Visit: http://localhost:3000');
  console.log('  3. Sign up for a new account\n');
} catch (error) {
  console.error('\n❌ Database initialization failed');
  console.error('Error:', error.message);
  process.exit(1);
}
