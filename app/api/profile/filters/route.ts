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

    const filters = await prisma.savedFilter.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    const formattedFilters = filters.map(filter => {
      const filterData = JSON.parse(filter.filterData)
      const description = Object.entries(filterData)
        .filter(([_, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`
          }
          return `${key}: ${value}`
        })
        .join(' | ')

      return {
        ...filter,
        description: description || 'No filters applied'
      }
    })

    return NextResponse.json({ filters: formattedFilters })
  } catch (error) {
    console.error('Filter fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
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

    const { name, filterData, isDefault } = await request.json()

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.savedFilter.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true
        },
        data: { isDefault: false }
      })
    }

    const filter = await prisma.savedFilter.create({
      data: {
        userId: session.user.id,
        name,
        filterData: JSON.stringify(filterData),
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({ filter }, { status: 201 })
  } catch (error) {
    console.error('Filter creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create filter' },
      { status: 500 }
    )
  }
}
