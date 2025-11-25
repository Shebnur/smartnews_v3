# SmartNews Intelligence Platform v3

Real-time news intelligence platform with AI-powered insights and comprehensive user authentication.

## Quick Start

```bash
npm install
./setup-auth.sh
npm run dev
```

Visit http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `RESEND_API_KEY` - Get from https://resend.com
- `DATABASE_URL` - Database connection

## Documentation

- **Setup Guide:** `AUTHENTICATION_SETUP.md`
- **Database Schema:** `prisma/schema.prisma`

## Tech Stack

Next.js 16 • React 19 • Prisma • NextAuth.js • Tailwind CSS 4

---

Built with Next.js and modern web technologies
