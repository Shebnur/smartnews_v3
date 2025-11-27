# 🚀 Supabase Migration Guide

This guide will help you migrate from SQLite (local dev) to Supabase PostgreSQL (production).

## 📋 Prerequisites

✅ Supabase project created and connected to Vercel
✅ Supabase connection strings ready
✅ Local SQLite database working (prisma/dev.db)

## 🔧 Step 1: Update Environment Variables

### For Local Development (.env)

```bash
# Replace these with your actual Supabase credentials
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

**Get these values from:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → Database**
4. Scroll to **Connection string**
5. Select **URI** mode
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your actual database password

### Example Values:
```bash
# Pooled connection (port 6543)
DATABASE_URL="postgresql://postgres.abcdefghijk:MySecurePass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (port 5432)
DIRECT_URL="postgresql://postgres.abcdefghijk:MySecurePass123@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

## 🗄️ Step 2: Update Prisma Schema

**Already done!** ✅ The schema has been updated to:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 📦 Step 3: Push Schema to Supabase

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push your schema to Supabase (creates all tables)
npx prisma db push

# 3. Verify in Prisma Studio
npx prisma studio
```

**What this does:**
- Creates all tables in your Supabase database
- Sets up relationships and indices
- No migration files needed (db push is for schema prototyping)

## 🔒 Step 4: Set Up Row-Level Security (RLS)

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Enable RLS on all user-related tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedFilter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedNews" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatArchive" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Research" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity" ENABLE ROW LEVEL SECURITY;

-- Note: For NextAuth-managed auth, you may want to allow
-- server-side access without RLS policies.
-- If using Supabase Auth, add policies like:

-- Example policy (adjust based on your auth setup)
CREATE POLICY "Users can view own data"
  ON "UserProfile" FOR SELECT
  USING (auth.uid()::text = "userId");
```

**Important:** Since you're using NextAuth (not Supabase Auth), you have two options:

### Option A: Disable RLS (Simpler for NextAuth)
```sql
-- If using NextAuth server-side only
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProfile" DISABLE ROW LEVEL SECURITY;
-- etc. for other tables
```

### Option B: Create service role policies
Your server-side code will need to use Supabase service role key to bypass RLS.

**Recommendation:** Start with **Option A** (disable RLS) since you're using NextAuth for authentication.

## ☁️ Step 5: Configure Vercel Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables for **Production**, **Preview**, and **Development**:

```bash
# Database
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]

# Email
RESEND_API_KEY=re_your_actual_key
EMAIL_FROM=noreply@yourdomain.com

# App
APP_URL=https://your-app.vercel.app
APP_NAME=SmartNews Intelligence
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## 🧪 Step 6: Test the Migration

### Test Locally:
```bash
# 1. Make sure .env has Supabase URLs
# 2. Start dev server
npm run dev

# 3. Try signing up a new user
# 4. Check Supabase Dashboard → Table Editor to see the data
```

### Test on Vercel:
```bash
# 1. Push your code
git add .
git commit -m "feat: Migrate to Supabase PostgreSQL"
git push

# 2. Vercel will auto-deploy
# 3. Test signup/login on your deployed app
# 4. Check Supabase for data
```

## 🔄 Migrate Existing SQLite Data (Optional)

If you have important data in your local SQLite database:

```bash
# 1. Export data from SQLite
npx prisma db execute --file export-data.sql --schema prisma/schema.prisma

# 2. Convert and import to PostgreSQL
# (Manual process - export as JSON, then import via API or Prisma seed)
```

## 📊 Verify Everything Works

1. **Check Tables in Supabase:**
   - Supabase Dashboard → Table Editor
   - You should see: User, UserProfile, Session, etc.

2. **Test Authentication:**
   - Sign up a new user
   - Verify email works (if configured)
   - Log in
   - Access profile page

3. **Test Features:**
   - Save a news article
   - Create a filter
   - Add a subscription

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Check your DATABASE_URL is correct
- Verify your IP is allowed in Supabase (should be 0.0.0.0/0 by default)
- Check Supabase project is active

### Error: "Prisma Client not generated"
```bash
npx prisma generate
rm -rf .next
npm run dev
```

### Connection Pooling Errors
- Use DATABASE_URL (port 6543) for app queries
- Use DIRECT_URL (port 5432) only for migrations

### RLS Blocking Queries
If you get permission errors:
```sql
-- Temporarily disable RLS for testing
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
```

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Connection strings added to .env
- [ ] Prisma schema updated (already done)
- [ ] `npx prisma db push` successful
- [ ] Tables visible in Supabase Dashboard
- [ ] Vercel environment variables configured
- [ ] Sign up/login works in production
- [ ] User data appears in Supabase

## 🎉 You're Done!

Your SmartNews app is now running on Supabase PostgreSQL!

**Benefits:**
- ✅ Production-ready PostgreSQL database
- ✅ Automatic backups
- ✅ Connection pooling
- ✅ Built-in authentication (optional)
- ✅ Real-time capabilities (future use)

---

**Need Help?**
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org/)
