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

    const chats = await prisma.chatArchive.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' }
    })

    const formattedChats = chats.map(chat => {
      const messages = JSON.parse(chat.messages)
      const preview = messages.length > 0 ? messages[0].content : 'No messages'

      return {
        id: chat.id,
        title: chat.title,
        preview: preview.substring(0, 100),
        messageCount: messages.length,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    })

    return NextResponse.json({ chats: formattedChats })
  } catch (error) {
    console.error('Chat fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
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

    const { title, messages } = await request.json()

    const chat = await prisma.chatArchive.create({
      data: {
        userId: session.user.id,
        title,
        messages: JSON.stringify(messages)
      }
    })

    return NextResponse.json({ chat }, { status: 201 })
  } catch (error) {
    console.error('Chat creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    )
  }
}
