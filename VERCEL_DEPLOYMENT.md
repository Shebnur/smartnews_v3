# Vercel Deployment Guide

## What Was Fixed

✅ **Build Configuration**
- Added `postinstall` script to auto-generate Prisma client
- Updated `build` script to ensure Prisma generation before Next.js build
- Created `vercel.json` with explicit build commands

✅ **Environment Variables**
- Created `.env.example` template for easy configuration
- Updated `.gitignore` to allow `.env.example` tracking

✅ **Documentation**
- Added comprehensive README.md
- Created deployment documentation

## Deploy to Vercel

### Step 1: Push Code to GitHub

Your code is already on branch: `claude/user-auth-profile-01LgGfqjcQkq8rmYadbxbnvx`

### Step 2: Import to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `Shebnur/smartnews_v3`
4. Select branch: `claude/user-auth-profile-01LgGfqjcQkq8rmYadbxbnvx`

### Step 3: Configure Environment Variables

Add these in Vercel dashboard under "Environment Variables":

#### Required Variables

```bash
# Database (Use PostgreSQL for production)
DATABASE_URL="postgresql://user:password@host:5432/smartnews"

# NextAuth - Generate secret
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secure-random-secret-here"

# Email Service (Resend)
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="noreply@yourdomain.com"

# App Configuration
APP_URL="https://your-app.vercel.app"
APP_NAME="SmartNews Intelligence"
```

#### Generate NEXTAUTH_SECRET

Run this locally and copy the output:
```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Set Up Database

#### Option A: Vercel Postgres (Recommended)

1. In Vercel dashboard, go to "Storage" tab
2. Click "Create Database" → "Postgres"
3. Follow setup wizard
4. Vercel will automatically add `DATABASE_URL` to your environment

#### Option B: External PostgreSQL

Use any PostgreSQL provider:
- **Supabase** (free tier available)
- **Railway** (free tier available)
- **Neon** (serverless Postgres)
- **PlanetScale** (MySQL alternative)

Get the connection string and add it as `DATABASE_URL`

### Step 5: Set Up Email Service

1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Get your API key from dashboard
3. Add to Vercel as `RESEND_API_KEY`
4. For production, verify your sending domain

### Step 6: Deploy

Click "Deploy" in Vercel dashboard.

Vercel will:
1. Install dependencies
2. Run `postinstall` → Generate Prisma Client
3. Run `build` → Build Next.js app
4. Deploy your application

### Step 7: Initialize Database Schema

After first deployment:

```bash
# Using Vercel CLI (install: npm i -g vercel)
vercel env pull .env.production.local
npx prisma db push
```

Or use Prisma Studio:
```bash
npx prisma studio
```

### Step 8: Test Your Deployment

1. Visit your Vercel URL
2. Go to `/auth/signup`
3. Create an account
4. Check email for verification
5. Log in and test profile features

## Troubleshooting

### Build Fails with "Prisma Client not generated"

**Solution:** The `postinstall` script should handle this automatically. If it still fails:

1. Check `package.json` has:
   ```json
   "postinstall": "prisma generate"
   ```

2. Or add to `vercel.json`:
   ```json
   {
     "buildCommand": "prisma generate && next build"
   }
   ```

### Database Connection Errors

**Solutions:**

1. **Check DATABASE_URL format:**
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
   ```

2. **Enable SSL mode** for production databases

3. **Check connection pooling** for serverless:
   ```
   DATABASE_URL="postgresql://...?connection_limit=10"
   ```

### Email Verification Not Working

**Solutions:**

1. **Check RESEND_API_KEY** is set correctly
2. **Verify EMAIL_FROM** matches your verified domain in Resend
3. **Check NEXTAUTH_URL** matches your deployment URL
4. **For development:** Resend allows sending to your own email without domain verification

### NextAuth Errors

**Solutions:**

1. **Ensure NEXTAUTH_SECRET** is set (required in production)
2. **Check NEXTAUTH_URL** matches your domain exactly
3. **No trailing slash** in NEXTAUTH_URL
4. **Use HTTPS** in production

### Middleware Warnings

The warning about middleware being deprecated is a Next.js message. It can be safely ignored for now. The middleware will continue to work.

## Production Checklist

Before going live:

- [ ] Set strong `NEXTAUTH_SECRET` (min 32 characters)
- [ ] Use production PostgreSQL database
- [ ] Configure custom domain in Vercel
- [ ] Verify email sending domain in Resend
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Enable rate limiting for API routes
- [ ] Configure CORS if needed
- [ ] Test authentication flow thoroughly
- [ ] Set up database backups
- [ ] Review security headers
- [ ] Enable 2FA for Vercel account

## Monitoring

### View Logs

Vercel Dashboard → Functions → Select function → View logs

### Database Monitoring

Use Prisma Studio:
```bash
npx prisma studio
```

### Error Tracking

Recommended services:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Vercel Analytics** - Built-in analytics

## Scaling Considerations

When your app grows:

1. **Database Connection Pooling**
   - Use Prisma Data Platform
   - Or implement connection pooling (PgBouncer)

2. **Email Service**
   - Upgrade Resend plan
   - Or use SendGrid, AWS SES

3. **Caching**
   - Implement Redis for session storage
   - Cache API responses

4. **CDN**
   - Vercel handles this automatically
   - Use for static assets

## Support

If you encounter issues:

1. Check Vercel build logs
2. Review Prisma migration logs
3. Test locally with production database
4. Check environment variables are set correctly

## Useful Commands

```bash
# Pull production environment variables
vercel env pull

# Deploy specific branch
vercel --prod

# View deployment logs
vercel logs

# Run database migrations
npx prisma migrate deploy

# View database
npx prisma studio
```

---

Your SmartNews Intelligence Platform is ready for production! 🚀
