import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface NewsFilters {
  sources?: string[]
  category?: string
  country?: string
  dateRange?: {
    start: string
    end: string
  }
  keywords?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Use Claude to understand the user's request and extract filters
    const systemPrompt = `You are a news search assistant. Your job is to understand user requests for news and extract relevant search filters.

Available filter options:
- sources: azertac, trend.az, bbc, reuters, bloomberg
- category: technology, economy, energy, health, sports, politics, general
- country: azerbaijan, global, us, uk, eu
- dateRange: Extract relative dates like "last 10 days", "this week", "past month"
- keywords: Extract important search terms

User request: "${message}"

Analyze this request and return ONLY a valid JSON object with the following structure:
{
  "filters": {
    "sources": ["source1", "source2"],
    "category": "category_name",
    "country": "country_name",
    "dateRange": {
      "daysAgo": number
    },
    "keywords": ["keyword1", "keyword2"]
  },
  "summary": "A brief explanation of what filters will be applied",
  "searchQuery": "Optimized search query string"
}

Example for "I want football news from last 10 days":
{
  "filters": {
    "category": "sports",
    "dateRange": {
      "daysAgo": 10
    },
    "keywords": ["football", "soccer"]
  },
  "summary": "Searching for sports news from the last 10 days, focusing on football",
  "searchQuery": "football sports news"
}

Return ONLY the JSON, no other text.`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: systemPrompt,
        },
      ],
    })

    // Parse Claude's response
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    let parsedResponse
    try {
      // Extract JSON from response (Claude might include markdown code blocks)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      parsedResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text)
      throw new Error('Failed to parse AI response')
    }

    // Build query parameters for the news API
    const params = new URLSearchParams()

    if (parsedResponse.filters.sources && parsedResponse.filters.sources.length > 0) {
      params.append('sources', parsedResponse.filters.sources.join(','))
    }

    if (parsedResponse.filters.category) {
      params.append('category', parsedResponse.filters.category)
    }

    if (parsedResponse.filters.country) {
      params.append('country', parsedResponse.filters.country)
    }

    // Fetch news with the generated filters
    const baseUrl = request.nextUrl.origin
    const newsResponse = await fetch(`${baseUrl}/api/news?${params.toString()}`)

    if (!newsResponse.ok) {
      throw new Error('Failed to fetch news')
    }

    const newsData = await newsResponse.json()

    // Filter by date range if specified
    let articles = newsData.articles || []
    if (parsedResponse.filters.dateRange?.daysAgo) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - parsedResponse.filters.dateRange.daysAgo)

      articles = articles.filter((article: any) => {
        const articleDate = new Date(article.publishedDate || article.date)
        return articleDate >= cutoffDate
      })
    }

    // Filter by keywords if specified
    if (parsedResponse.filters.keywords && parsedResponse.filters.keywords.length > 0) {
      articles = articles.filter((article: any) => {
        const text = `${article.title} ${article.summary}`.toLowerCase()
        return parsedResponse.filters.keywords.some((keyword: string) =>
          text.includes(keyword.toLowerCase())
        )
      })
    }

    return NextResponse.json({
      success: true,
      filters: parsedResponse.filters,
      summary: parsedResponse.summary,
      searchQuery: parsedResponse.searchQuery,
      articles: articles,
      count: articles.length,
    })
  } catch (error) {
    console.error('AI Agent error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
