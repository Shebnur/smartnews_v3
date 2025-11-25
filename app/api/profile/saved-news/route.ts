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

    const savedNews = await prisma.savedNews.findMany({
      where: { userId: session.user.id },
      orderBy: { savedAt: 'desc' }
    })

    return NextResponse.json({ savedNews })
  } catch (error) {
    console.error('Saved news fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved news' },
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

    const { articleId, articleUrl, title, summary, category, source, imageUrl, notes, tags } = await request.json()

    const savedNews = await prisma.savedNews.create({
      data: {
        userId: session.user.id,
        articleId,
        articleUrl,
        title,
        summary,
        category,
        source,
        imageUrl,
        notes,
        tags
      }
    })

    return NextResponse.json({ savedNews }, { status: 201 })
  } catch (error: any) {
    console.error('Saved news creation error:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Article already saved' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to save news' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.savedNews.delete({
      where: {
        id,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Saved news deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete saved news' },
      { status: 500 }
    )
  }
}
