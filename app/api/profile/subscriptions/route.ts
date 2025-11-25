import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, value, frequency } = await request.json()

    if (!['category', 'source', 'keyword', 'region'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid subscription type' },
        { status: 400 }
      )
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        type,
        value,
        frequency: frequency || 'daily',
        isActive: true
      }
    })

    return NextResponse.json({ subscription }, { status: 201 })
  } catch (error) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
