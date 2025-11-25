# User Authentication & Profile Setup Guide

## Overview

Your SmartNews Intelligence Platform now has a complete user authentication and profile management system!

## Features Implemented

### ✅ Authentication System
- **Sign Up**: Email and password registration
- **Email Verification**: Automatic verification emails sent after signup
- **Login/Logout**: Secure session management with JWT
- **Protected Routes**: Automatic redirection for unauthorized access

### ✅ User Profile Dashboard
Accessible at `/profile` after logging in, includes:

1. **Activity Overview**
   - Time spent on platform
   - Articles read counter
   - Research projects count
   - AI chat history count
   - Top categories read with statistics

2. **AI Chat Archives**
   - View all past AI assistant conversations
   - Archive chat history automatically
   - Search through past chats

3. **Research History**
   - Track all research queries
   - View articles found per research
   - Access past research results

4. **Saved Filters**
   - Create custom filter presets
   - Quick apply frequently used filters
   - Set default filters

5. **Saved News / Bookmarks**
   - Bookmark articles for later reading
   - Organize saved articles
   - Add notes and tags

6. **Subscriptions**
   - Subscribe to categories, sources, keywords, regions
   - Configure notification frequency (realtime/daily/weekly)
   - Toggle subscriptions on/off

7. **Account Settings**
   - Update profile information
   - Change password
   - Email preferences
   - Account deletion

## Database Schema

The following database models have been created:

- **User**: Core user account data
- **UserProfile**: Extended profile information
- **VerificationToken**: Email verification tokens
- **Session**: User sessions
- **ChatArchive**: Saved AI chat conversations
- **Research**: Research history tracking
- **Activity**: User activity tracking (articles read, time spent, etc.)
- **SavedFilter**: Custom filter configurations
- **SavedNews**: Bookmarked articles
- **Subscription**: User notification subscriptions

## Setup Instructions

### 1. Environment Configuration

Update your `.env` file with the following:

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth (Generate a secure secret)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"

# Email Service (Sign up at https://resend.com)
RESEND_API_KEY="your-resend-api-key-here"
EMAIL_FROM="noreply@yourdomain.com"

# App Configuration
APP_URL="http://localhost:3000"
APP_NAME="SmartNews Intelligence"
```

**Important**: Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 2. Database Initialization

Run these commands to set up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Create and initialize the database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 3. Email Service Setup

1. Sign up for a free account at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Add it to your `.env` file as `RESEND_API_KEY`
4. Verify your sending domain (for production)

For development, Resend allows sending to your own email without domain verification.

### 4. Start the Development Server

```bash
npm run dev
```

Visit:
- Main app: `http://localhost:3000`
- Sign up: `http://localhost:3000/auth/signup`
- Login: `http://localhost:3000/auth/login`
- Profile: `http://localhost:3000/profile` (after login)

## Usage Flow

### New User Registration

1. User visits `/auth/signup`
2. Fills in email and password (min 8 characters)
3. Submits form
4. Account created in database
5. Verification email sent automatically
6. User clicks verification link in email
7. Account verified
8. User can now log in at `/auth/login`

### Logging In

1. User visits `/auth/login`
2. Enters email and password
3. System checks credentials
4. If email not verified, shows error
5. If verified, creates session
6. Redirects to main app `/`

### Using Profile Features

1. Click user menu in top right
2. Select "My Profile"
3. Navigate between tabs:
   - Activity: View statistics
   - Chats: Access AI chat history
   - Research: View past research
   - Filters: Manage saved filters
   - Saved: View bookmarked articles
   - Subscriptions: Manage alerts
   - Settings: Update account

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handler (login/logout)
- `GET /api/auth/verify-email?token=xxx` - Verify email

### Profile Data
- `GET /api/profile` - Get profile overview
- `GET /api/profile/chats` - Get chat archives
- `POST /api/profile/chats` - Save new chat
- `GET /api/profile/research` - Get research history
- `POST /api/profile/research` - Save research
- `GET /api/profile/filters` - Get saved filters
- `POST /api/profile/filters` - Create filter
- `GET /api/profile/saved-news` - Get bookmarked articles
- `POST /api/profile/saved-news` - Bookmark article
- `DELETE /api/profile/saved-news?id=xxx` - Remove bookmark
- `GET /api/profile/subscriptions` - Get subscriptions
- `POST /api/profile/subscriptions` - Create subscription
- `PATCH /api/profile/subscriptions/[id]` - Update subscription
- `DELETE /api/profile/subscriptions/[id]` - Delete subscription
- `POST /api/profile/activity` - Track activity

## Integration with Main App

The authentication system is fully integrated:

1. **Header**: Shows login/signup or user menu
2. **Session Management**: Tracks user session across the app
3. **Protected Routes**: `/profile` and `/api/profile/*` require login
4. **Activity Tracking**: Ready to track user interactions

## Next Steps - Tracking User Activity

To automatically track user activity, add these API calls in your main app:

### Track Article Read
```typescript
await fetch('/api/profile/activity', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'article_read',
    articleId: article.id.toString(),
    articleTitle: article.title,
    category: article.category,
    timeSpent: 120, // seconds
  })
})
```

### Track Search/Filter
```typescript
await fetch('/api/profile/activity', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'search',
    metadata: JSON.stringify(filters)
  })
})
```

### Save Chat
```typescript
await fetch('/api/profile/chats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Chat about...',
    messages: chatMessages
  })
})
```

### Bookmark Article
```typescript
await fetch('/api/profile/saved-news', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleId: article.id.toString(),
    title: article.title,
    summary: article.summary,
    category: article.category,
    source: article.source,
    articleUrl: article.sourceUrl,
    imageUrl: article.imageUrl
  })
})
```

## Security Features

✅ **Password Hashing**: bcrypt with 10 rounds
✅ **Email Verification**: Required before login
✅ **JWT Sessions**: Secure session tokens
✅ **Protected Routes**: Middleware authentication
✅ **CSRF Protection**: Built into NextAuth
✅ **SQL Injection Prevention**: Prisma parameterized queries

## Troubleshooting

### Prisma Issues
If you get Prisma errors:
```bash
# Clean and regenerate
rm -rf node_modules/.prisma
npx prisma generate
npx prisma db push
```

### Email Not Sending
- Check RESEND_API_KEY is set correctly
- Verify EMAIL_FROM is a valid email
- Check Resend dashboard for errors
- For dev, ensure sending to verified email

### Login Fails
- Ensure email is verified (check database or Prisma Studio)
- Check password is at least 8 characters
- Verify NEXTAUTH_SECRET is set
- Check browser console for errors

## Database Management

### View Data
```bash
npx prisma studio
```

### Reset Database
```bash
rm prisma/dev.db
npx prisma db push
```

### Add Test User Manually
```bash
npx prisma studio
# Or use the signup page
```

## Production Deployment

Before deploying to production:

1. ✅ Set strong NEXTAUTH_SECRET
2. ✅ Use production database (PostgreSQL recommended)
3. ✅ Configure NEXTAUTH_URL to production URL
4. ✅ Set up proper email domain in Resend
5. ✅ Enable HTTPS only
6. ✅ Set up rate limiting
7. ✅ Configure CORS properly
8. ✅ Set up monitoring/logging

## Files Created

### Configuration
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables
- `middleware.ts` - Route protection
- `types/next-auth.d.ts` - TypeScript types

### Library
- `lib/prisma.ts` - Prisma client
- `lib/auth.ts` - NextAuth configuration
- `lib/email.ts` - Email service

### API Routes
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/signup/route.ts`
- `app/api/auth/verify-email/route.ts`
- `app/api/profile/route.ts`
- `app/api/profile/chats/route.ts`
- `app/api/profile/research/route.ts`
- `app/api/profile/filters/route.ts`
- `app/api/profile/saved-news/route.ts`
- `app/api/profile/subscriptions/route.ts`
- `app/api/profile/subscriptions/[id]/route.ts`
- `app/api/profile/activity/route.ts`

### Pages
- `app/auth/signup/page.tsx`
- `app/auth/login/page.tsx`
- `app/auth/verify-email/page.tsx`
- `app/profile/page.tsx`

### Components
- `app/components/AuthNav.tsx`
- `app/providers.tsx`

## Support

For issues or questions:
1. Check this documentation
2. Review the Prisma schema
3. Check browser console for errors
4. Review Next.js and NextAuth documentation

---

**Congratulations!** Your SmartNews Intelligence Platform now has a complete authentication and user profile system. Users can sign up, verify their email, log in, and access personalized features. 🎉
