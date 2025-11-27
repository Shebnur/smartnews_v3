import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, articleId, articleTitle, category, timeSpent, metadata } = await request.json()

    const activity = await prisma.activity.create({
      data: {
        userId: session.user.id,
        type,
        articleId,
        articleTitle,
        category,
        timeSpent: timeSpent || 0,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })

    return NextResponse.json({ activity }, { status: 201 })
  } catch (error) {
    console.error('Activity tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    )
  }
}
