import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { success: true, message: 'If that email exists, a reset link has been sent.' },
        { status: 200 }
      )
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    const identifier = `password-reset:${email}`

    // Delete any existing reset tokens for this email
    await prisma.verificationToken.deleteMany({ where: { identifier } })

    // Create new reset token
    await prisma.verificationToken.create({
      data: {
        identifier,
        token: resetToken,
        expires: tokenExpiry,
        userId: user.id,
      },
    })

    try {
      await sendPasswordResetEmail(email, resetToken)
    } catch (emailError: any) {
      console.error('Failed to send password reset email:', emailError)
      return NextResponse.json(
        { error: emailError.message || 'Email service unavailable. Please contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'If that email exists, a reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
