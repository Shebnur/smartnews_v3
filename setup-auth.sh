#!/bin/bash

echo "🚀 SmartNews Authentication Setup"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from template..."
    cat > .env << EOF
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key-here"
EMAIL_FROM="noreply@smartnews.com"

# App Configuration
APP_URL="http://localhost:3000"
APP_NAME="SmartNews Intelligence"
EOF
    echo "✅ .env file created with random NEXTAUTH_SECRET"
    echo ""
fi

echo "📦 Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully"
else
    echo "⚠️  Prisma generate failed, but continuing..."
fi

echo ""
echo "🗄️  Initializing Database..."
npx prisma db push --skip-generate

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully"
else
    echo "⚠️  Database initialization failed"
    echo "   You may need to run 'npx prisma db push' manually"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update RESEND_API_KEY in .env (sign up at https://resend.com)"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000/auth/signup to create an account"
echo ""
echo "📖 For detailed documentation, see AUTHENTICATION_SETUP.md"
