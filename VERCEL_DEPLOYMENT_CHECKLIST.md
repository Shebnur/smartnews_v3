# ✅ Vercel Deployment Checklist

Your build succeeded, but you may be getting runtime errors. Let's verify everything is configured.

## 🔍 What Your Build Logs Show

✅ **Build Success:** Compiled successfully in 15.8s
✅ **Pages Generated:** All 21/21 pages generated
⚠️ **Middleware Warning:** This is just a deprecation warning, not an error

## 🚨 Most Common Issue: Missing Environment Variables

If you're getting errors when **using the app** (not during build), it's likely missing environment variables.

### Check Your Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Verify these variables exist** for Production, Preview, and Development:

```bash
# Required for Database
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

# Required for NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=[your-generated-secret]

# Optional (Email)
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@yourdomain.com

# Optional (App)
APP_URL=https://your-app.vercel.app
APP_NAME=SmartNews Intelligence
```

## 🔧 How to Add/Update Environment Variables

### Step 1: Add the Variables

1. **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Enter:
   - **Name:** `DATABASE_URL`
   - **Value:** Your Supabase connection string (port 6543)
   - **Environments:** Check all (Production, Preview, Development)
5. Click **"Save"**

Repeat for:
- `DIRECT_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- etc.

### Step 2: Redeploy

After adding variables, you **must redeploy**:

**Option A: Trigger new deployment**
```bash
git commit --allow-empty -m "chore: Trigger redeploy with env vars"
git push
```

**Option B: Use Vercel UI**
- Go to **Deployments** tab
- Click **"..."** on latest deployment
- Click **"Redeploy"**

## 🐛 Common Errors and Solutions

### Error: "Prisma Client not initialized" (Runtime)

**Cause:** DATABASE_URL not set in Vercel

**Solution:**
1. Add `DATABASE_URL` and `DIRECT_URL` in Vercel environment variables
2. Redeploy

### Error: "Can't reach database server"

**Cause:** Wrong connection string or Supabase is down

**Solution:**
1. Double-check your DATABASE_URL format
2. Port should be **6543** (not 5432) for pooled connection
3. Check Supabase Dashboard → Project is active

### Error: "Invalid credentials" (NextAuth)

**Cause:** NEXTAUTH_SECRET not set or wrong

**Solution:**
1. Generate new secret: `openssl rand -base64 32`
2. Add to Vercel as `NEXTAUTH_SECRET`
3. Redeploy

### Error: "NEXTAUTH_URL is not set"

**Cause:** NEXTAUTH_URL missing

**Solution:**
1. Add `NEXTAUTH_URL=https://your-app.vercel.app` (use your actual domain)
2. Redeploy

## 🎯 Quick Fix Script

Run this to check your Vercel environment variables:

```bash
# List all environment variables (requires Vercel CLI)
vercel env ls

# If you don't have Vercel CLI:
npm i -g vercel
vercel login
vercel link
vercel env ls
```

## 📊 Verify Deployment

### Check Build Logs
1. Go to **Vercel Dashboard** → **Deployments**
2. Click on latest deployment
3. Check **Build Logs** - should show "Compiled successfully"
4. Check **Function Logs** (Runtime) - this is where errors appear!

### Check Function Logs (Most Important!)
1. **Vercel Dashboard** → **Deployments** → Latest deployment
2. Click **"Function Logs"** or **"Logs"** tab
3. Try using your app (sign up, login)
4. Watch for errors in real-time

## 🧪 Test Your Deployment

1. **Visit your deployed URL:** https://your-app.vercel.app
2. **Try signing up:**
   - Click profile icon
   - Click "Sign Up"
   - Fill in form
   - Submit
3. **Check for errors:**
   - In browser console (F12)
   - In Vercel Function Logs

## ✅ Success Indicators

Your deployment is working if:
- ✅ Home page loads
- ✅ Sign up form appears
- ✅ Sign up succeeds (no errors)
- ✅ User appears in Supabase Dashboard → Table Editor → User table
- ✅ Login works
- ✅ Profile page loads

## 📋 Environment Variables for Your Project

**IMPORTANT:** Add these EXACT values to Vercel Dashboard → Settings → Environment Variables:

```bash
# Database (Supabase) - UPDATED PASSWORD
DATABASE_URL=postgresql://postgres.adkioyqnvnkikwntvggf:SmartNews2024!Secure@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres.adkioyqnvnkikwntvggf:SmartNews2024!Secure@db.adkioyqnvnkikwntvggf.supabase.co:5432/postgres

# NextAuth (Production)
NEXTAUTH_URL=https://smartnews-v3.vercel.app

NEXTAUTH_SECRET=dyO+KQeOl3xBtGAzbg1TYycjnzO8j5X4jgWWJBqzFcs=

# Optional (Email)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@smartnews.com

# App
APP_URL=https://smartnews-v3.vercel.app
APP_NAME=SmartNews Intelligence
```

**⚠️ After adding these variables, you MUST redeploy for changes to take effect!**

## 🗄️ CRITICAL: Create Database Tables First!

**Before signup will work, you MUST create the tables in Supabase:**

1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Copy and paste the entire content of `supabase-schema.sql`
5. Click **"Run"** button
6. Verify: Check **Table Editor** - you should see 12 tables (User, UserProfile, Account, Session, etc.)

**Without these tables, signup will fail with "table does not exist" errors!**

## 🎉 Next Steps

1. **Add all environment variables** in Vercel
2. **Redeploy** (git push or Vercel UI)
3. **Check Function Logs** for runtime errors
4. **Test signup/login** on your deployed app
5. **Verify data** appears in Supabase

---

**Still seeing errors?** Share the **Function Logs** (not Build Logs) from Vercel and I can help debug!
