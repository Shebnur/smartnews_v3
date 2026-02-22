import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find the token — must be a password-reset token
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!resetToken || !resetToken.identifier.startsWith('password-reset:')) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Please request a new one.' },
        { status: 400 }
      )
    }

    if (resetToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json(
        { error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    if (!resetToken.user) {
      return NextResponse.json(
        { error: 'Invalid reset link.' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: resetToken.user.id },
      data: { password: hashedPassword },
    })

    await prisma.verificationToken.delete({ where: { token } })

    return NextResponse.json(
      { success: true, message: 'Password updated successfully. You can now log in.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
