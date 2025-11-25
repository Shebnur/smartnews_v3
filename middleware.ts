import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow the request to proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect the profile routes
        if (req.nextUrl.pathname.startsWith('/profile')) {
          return !!token
        }
        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/profile/:path*',
    '/api/profile/:path*'
  ]
}
