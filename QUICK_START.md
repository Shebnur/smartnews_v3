# Quick Start Guide

## Fix the Signup Error

The signup error occurs because the database hasn't been initialized yet. Follow these steps:

### 1. Initialize the Database

```bash
# Run the database initialization script
npm run db:init
```

This will:
- Generate Prisma Client
- Create the SQLite database
- Set up all required tables

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Test Sign Up

1. Visit http://localhost:3000
2. Click the **profile icon** in the top right
3. Select **"Sign Up"** from the dropdown
4. Create your account!

## New UI Features

### Profile Icon

**When Not Logged In:**
- Click the profile icon → See Login/Sign Up options
- Clean dropdown menu with icons
- No clutter in the header

**When Logged In:**
- See your avatar with initials
- Click to access Profile or Sign Out
- Shows your name/email

### Key Improvements

✅ **Cleaner Header** - Single profile icon instead of multiple buttons
✅ **Better UX** - Dropdown menu keeps header clean
✅ **User Avatar** - Shows first letter of name when logged in
✅ **Smooth Animations** - Professional transitions and hover effects
✅ **Click Outside to Close** - Menu closes when clicking anywhere

## Database Management

```bash
# Initialize database
npm run db:init

# View/edit data in Prisma Studio
npm run db:studio

# Reset database (if needed)
rm prisma/dev.db
npm run db:init
```

## Troubleshooting

### "An error occurred during signup"

**Solution:** Run `npm run db:init` to create the database

### Database already exists

If you see errors about existing tables:

```bash
# Remove old database
rm prisma/dev.db

# Reinitialize
npm run db:init
```

### Email verification not working

Email verification requires a Resend API key. For testing:
- You can manually verify users in Prisma Studio
- Or set up Resend (see AUTHENTICATION_SETUP.md)

To manually verify:
1. Run: `npm run db:studio`
2. Open User table
3. Set `emailVerified` to current timestamp
4. You can now log in!

## What's Next?

After signing up:
1. Check your email for verification (if Resend is configured)
2. Or manually verify in Prisma Studio
3. Log in and explore your profile
4. Check out activity tracking, saved articles, and more!

## Need Help?

- **Full Documentation:** See `AUTHENTICATION_SETUP.md`
- **Deployment Guide:** See `VERCEL_DEPLOYMENT.md`
- **Database Schema:** See `prisma/schema.prisma`

---

Enjoy your SmartNews Intelligence Platform! 🚀
