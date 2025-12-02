import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Debug route to check session status
export async function GET() {
  try {
    const session = await auth()

    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      authenticated: false
    }, { status: 500 })
  }
}
