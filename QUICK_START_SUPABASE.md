# ⚡ Quick Start: Supabase Setup

Get your SmartNews app running with Supabase in 5 minutes!

## 🚀 Quick Commands

### Option 1: Automatic Setup (Recommended)
```bash
# Run the setup script
./scripts/update-env-supabase.sh

# Then push schema to Supabase
npx prisma db push

# Start development
npm run dev
```

### Option 2: Manual Setup
```bash
# 1. Copy example env
cp .env.example .env

# 2. Edit .env and add your Supabase credentials
nano .env  # or use your preferred editor

# 3. Update these lines:
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# 4. Push schema
npx prisma db push

# 5. Start dev server
npm run dev
```

## 📍 Getting Your Supabase Credentials

1. **Go to Supabase Dashboard:** https://supabase.com/dashboard
2. **Select your project**
3. **Settings → Database** (in left sidebar)
4. **Scroll to "Connection string"**
5. **Select "URI" mode**
6. **Copy the string** (shows your PROJECT-REF and REGION)
7. **Replace `[YOUR-PASSWORD]` with your actual password**

### Example Connection String:
```
postgresql://postgres.xyzabcdef123:MySecurePass@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

From this example:
- **PROJECT-REF:** `xyzabcdef123`
- **PASSWORD:** `MySecurePass`
- **REGION:** `us-east-1`

## ✅ Verify Setup

```bash
# Check if tables were created
npx prisma studio

# You should see all tables:
# - User
# - UserProfile
# - Session
# - VerificationToken
# - ChatArchive
# - Research
# - Activity
# - SavedFilter
# - SavedNews
# - Subscription
```

## 🎯 Test Authentication

1. **Start server:** `npm run dev`
2. **Open:** http://localhost:3000
3. **Click profile icon** (top right)
4. **Sign up** with test credentials
5. **Check Supabase Dashboard → Table Editor**
6. **You should see your user** in the User table!

## 🔧 Troubleshooting

### Error: "Can't reach database server"
**Solution:** Check your connection string format:
- Port **6543** for DATABASE_URL (pooled)
- Port **5432** for DIRECT_URL (direct)
- Password must be URL-encoded if it contains special characters

### Error: "Prisma Client not initialized"
```bash
npx prisma generate
rm -rf .next
npm run dev
```

### Error: "Migration failed"
```bash
# Use db push instead of migrate (for prototyping)
npx prisma db push

# If that fails, check Supabase is active:
# Dashboard → Project Settings → check status
```

## ☁️ Deploy to Vercel

1. **Add environment variables in Vercel:**
   - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

2. **Add these variables:**
   ```
   DATABASE_URL=postgresql://...  (port 6543)
   DIRECT_URL=postgresql://...     (port 5432)
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=[run: openssl rand -base64 32]
   RESEND_API_KEY=re_...
   EMAIL_FROM=noreply@yourdomain.com
   ```

3. **Push your code:**
   ```bash
   git push
   ```

4. **Vercel auto-deploys!** 🎉

## 📚 Full Documentation

For detailed instructions, see:
- **SUPABASE_MIGRATION.md** - Complete migration guide
- **SETUP_INSTRUCTIONS.md** - Local development setup

## 🎉 Success!

Once `npx prisma db push` completes successfully:
- ✅ All 11 tables created in Supabase
- ✅ User authentication ready
- ✅ Profile system functional
- ✅ Production database configured

**Your SmartNews Intelligence platform is ready for production! 🚀**
