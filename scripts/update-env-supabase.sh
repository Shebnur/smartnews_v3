#!/bin/bash

# Script to help update .env with Supabase credentials

echo "🔧 Supabase Environment Setup"
echo "================================"
echo ""
echo "This script will help you update your .env file with Supabase credentials."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
fi

echo "Please provide your Supabase connection details:"
echo ""
echo "📍 Get these from: Supabase Dashboard → Settings → Database"
echo "   Copy 'Connection string' in URI mode"
echo ""

# Read Supabase project details
read -p "Enter your Supabase PROJECT-REF (e.g., abcdefghijk): " PROJECT_REF
read -sp "Enter your DATABASE PASSWORD: " DB_PASSWORD
echo ""
read -p "Enter your REGION (e.g., us-east-1): " REGION

# Construct connection strings
POOLED_URL="postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-${REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-${REGION}.pooler.supabase.com:5432/postgres"

echo ""
echo "📝 Updating .env file..."

# Backup existing .env
cp .env .env.backup

# Update DATABASE_URL and DIRECT_URL
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"${POOLED_URL}\"|" .env
sed -i "s|DIRECT_URL=.*|DIRECT_URL=\"${DIRECT_URL}\"|" .env

# If DIRECT_URL doesn't exist, add it after DATABASE_URL
if ! grep -q "DIRECT_URL" .env; then
  sed -i "/DATABASE_URL=/a DIRECT_URL=\"${DIRECT_URL}\"" .env
fi

echo "✅ .env file updated!"
echo ""
echo "📊 Next steps:"
echo "1. Generate Prisma client:  npx prisma generate"
echo "2. Push schema to Supabase: npx prisma db push"
echo "3. Verify in Prisma Studio:  npx prisma studio"
echo ""
echo "💡 Backup saved as: .env.backup"
