import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const researches = await prisma.research.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ researches })
  } catch (error) {
    console.error('Research fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch research history' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, query, results, articlesCount } = await request.json()

    const research = await prisma.research.create({
      data: {
        userId: session.user.id,
        title,
        query,
        results: JSON.stringify(results),
        articlesCount
      }
    })

    return NextResponse.json({ research }, { status: 201 })
  } catch (error) {
    console.error('Research creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create research' },
      { status: 500 }
    )
  }
}
