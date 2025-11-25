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

    // Get user activities
    const activities = await prisma.activity.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // Calculate statistics
    const totalTimeSpent = activities.reduce((acc, act) => acc + act.timeSpent, 0)
    const articlesRead = activities.filter(act => act.type === 'article_read').length
    const chatCount = await prisma.chatArchive.count({
      where: { userId: session.user.id }
    })
    const researchCount = await prisma.research.count({
      where: { userId: session.user.id }
    })

    // Get top categories
    const categoryStats: { [key: string]: number } = {}
    activities.forEach(act => {
      if (act.category) {
        categoryStats[act.category] = (categoryStats[act.category] || 0) + 1
      }
    })

    const topCategories = Object.entries(categoryStats)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / articlesRead) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Format recent activities
    const recentActivities = activities.slice(0, 10).map(act => ({
      title: act.articleTitle || 'Activity',
      type: act.type,
      time: new Date(act.createdAt).toLocaleDateString(),
      category: act.category
    }))

    return NextResponse.json({
      totalTimeSpent: `${Math.floor(totalTimeSpent / 3600)}h ${Math.floor((totalTimeSpent % 3600) / 60)}m`,
      articlesRead,
      chatCount,
      researchCount,
      topCategories,
      recentActivities
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    )
  }
}
