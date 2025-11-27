# 🔧 Profile Page Authentication Fix

## ❌ Issue
Clicking "My Profile" redirects to login page even after successful login.

## 🔍 Root Cause
NextAuth v5 session/cookie configuration issues:
1. Missing explicit cookie configuration
2. Middleware using deprecated `getToken()` instead of `auth()`
3. Cookie not being set/read properly in production

## ✅ Fixes Applied

### 1. Added Explicit Cookie Configuration (`lib/auth.ts`)
```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    }
  }
}
```

### 2. Updated Middleware to Use auth() (`middleware.ts`)
Changed from:
```typescript
const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
```

To:
```typescript
const session = await auth()
```

### 3. Added Debug Mode for Development
```typescript
debug: process.env.NODE_ENV === 'development',
```

### 4. Enhanced JWT Callback
```typescript
async jwt({ token, user, trigger }) {
  if (user) {
    token.id = user.id
    token.email = user.email
    token.name = user.name
    token.image = user.image
  }
  return token
}
```

## 🚀 Deployment Steps

### Step 1: Verify Vercel Environment Variables

**Critical:** Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

```bash
NEXTAUTH_URL=https://smartnews-v3.vercel.app
NEXTAUTH_SECRET=dyO+KQeOl3xBtGAzbg1TYycjnzO8j5X4jgWWJBqzFcs=
DATABASE_URL=postgresql://postgres.adkioyqnvnkikwntvggf:SmartNews2024!Secure@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.adkioyqnvnkikwntvggf:SmartNews2024!Secure@db.adkioyqnvnkikwntvggf.supabase.co:5432/postgres
```

**Important:** `NEXTAUTH_URL` must match your exact production domain!

### Step 2: Commit and Push
```bash
git add .
git commit -m "fix: Resolve profile page authentication with proper NextAuth v5 config"
git push
```

### Step 3: Wait for Deployment
- Monitor: https://vercel.com/dashboard
- Wait for "Ready" status (~2 minutes)

### Step 4: Clear Cookies and Test

**CRITICAL:** Old cookies from broken session will prevent new ones from working!

**Option A: Use Incognito/Private Mode**
- Open incognito window
- Visit: https://smartnews-v3.vercel.app
- Login
- Click "My Profile"
- ✅ Should navigate to /profile

**Option B: Clear Cookies Manually**
Chrome:
1. Open DevTools (F12)
2. Application tab → Cookies
3. Delete all cookies for smartnews-v3.vercel.app
4. Refresh page
5. Login again

Firefox:
1. Open DevTools (F12)
2. Storage tab → Cookies
3. Delete all cookies
4. Refresh and login

### Step 5: Verify Session is Working

After logging in, test the session:
1. Visit: https://smartnews-v3.vercel.app/api/auth/session-debug
2. Should see:
```json
{
  "authenticated": true,
  "session": {
    "user": {
      "id": "...",
      "email": "test@example.com",
      "name": "Test User"
    },
    "expires": "..."
  }
}
```

If you see `"authenticated": false`, the session isn't being created.

## 🐛 If Still Not Working

### Check 1: Verify NEXTAUTH_URL
In Vercel Dashboard:
- Go to Settings → Environment Variables
- Find `NEXTAUTH_URL`
- **Must be:** `https://smartnews-v3.vercel.app` (no trailing slash!)
- Must match your exact domain

### Check 2: Check Browser Console
After logging in:
1. Open DevTools (F12) → Console tab
2. Look for errors like:
   - "Failed to fetch session"
   - "NEXTAUTH_URL missing"
   - Cookie warnings

### Check 3: Check Vercel Function Logs
1. Vercel Dashboard → Deployments → Latest
2. Click "Functions" or "Logs" tab
3. Try logging in
4. Look for errors in:
   - `/api/auth/callback/credentials`
   - `/api/auth/session`

### Check 4: Verify Cookies Are Set
After successful login:
1. Open DevTools → Application tab → Cookies
2. Look for: `next-auth.session-token`
3. It should have:
   - Value: Long JWT string
   - HttpOnly: ✓
   - Secure: ✓ (in production)
   - SameSite: Lax
   - Path: /

If cookie is NOT there → session creation failed

## 📊 Testing Checklist

After deployment, test this flow:

- [ ] Clear all cookies or use incognito
- [ ] Visit homepage
- [ ] Click profile icon → See "Login" and "Sign Up"
- [ ] Click "Login"
- [ ] Enter valid credentials
- [ ] Submit login form
- [ ] **Check:** Redirected to homepage (not stuck on login)
- [ ] **Check:** Profile icon now shows your avatar/initial
- [ ] Click profile icon again
- [ ] **Check:** See "My Profile" and "Sign Out" options
- [ ] Click "My Profile"
- [ ] **Expected:** Navigate to /profile page ✅
- [ ] **Expected:** See your profile dashboard with tabs
- [ ] **Not Expected:** Redirect back to login ❌

## 🔬 Debug API Endpoints

Created debug endpoint: `/api/auth/session-debug`

Use this to check if sessions are working:
- Logged out: `{ "authenticated": false, "session": null }`
- Logged in: `{ "authenticated": true, "session": {...} }`

## 💡 Key Changes Summary

| File | Change | Why |
|------|--------|-----|
| `lib/auth.ts` | Added `cookies` config | Explicit cookie handling for NextAuth v5 |
| `lib/auth.ts` | Added `debug: true` | Enable debugging in development |
| `lib/auth.ts` | Enhanced jwt callback | Added `trigger` parameter |
| `middleware.ts` | Use `auth()` instead of `getToken()` | NextAuth v5 best practice |
| `app/api/auth/session-debug/route.ts` | New debug endpoint | Test session status |

## 📚 References

- NextAuth v5 Docs: https://authjs.dev/getting-started/migrating-to-v5
- Cookies Config: https://authjs.dev/reference/core#cookies
- Middleware: https://authjs.dev/guides/middleware

---

**After following these steps, profile navigation should work! 🎉**

If you still have issues, share:
1. Response from `/api/auth/session-debug` while logged in
2. Vercel function logs during login
3. Browser console errors
