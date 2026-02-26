import { NextRequest, NextResponse } from 'next/server'
import { gnewsService } from '@/lib/gnews'
import { articleService } from '@/lib/articleService'
import { ScraperManager } from '@/app/services/scrapers/ScraperManager'

const scraperManager = new ScraperManager()

// Feature flag to enable/disable GNews API
const USE_GNEWS = process.env.GNEWS_API_KEY !== undefined

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const category = searchParams.get('category') || undefined
  const country = searchParams.get('country') || undefined
  const fresh = searchParams.get('fresh') === 'true' // Force fresh fetch from API
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    // Strategy: Database-first with smart refresh
    // 1. Check if we have fresh articles in DB (< 1 hour old)
    // 2. If yes, serve from DB (fast, free)
    // 3. If no or fresh=true, fetch from GNews + regional scrapers

    const hasFreshData = fresh ? false : await articleService.hasFreshArticles(60)

    if (hasFreshData && !fresh) {
      // Serve from database
      console.log('[News API] Serving from database cache')
      const articles = await articleService.getArticles({
        category,
        limit,
      })

      return NextResponse.json({
        success: true,
        source: 'cache',
        articles: articles.map(transformDbArticle),
        count: articles.length,
      })
    }

    // Fetch fresh data
    console.log('[News API] Fetching fresh data from APIs')
    const allArticles = []

    // 1. Fetch from GNews API (if enabled and API key exists)
    if (USE_GNEWS) {
      try {
        const gnewsParams: any = {
          max: 20,
          lang: 'en',
        }

        if (category) {
          gnewsParams.category = mapCategory(category)
        }

        if (country && country !== 'az') {
          gnewsParams.country = country
        }

        const gnewsData = await gnewsService.getTopHeadlines(gnewsParams)

        // Transform and add GNews articles
        const gnewsArticles = gnewsData.articles.map((article, index) =>
          gnewsService.transformArticle(article, index)
        )

        allArticles.push(...gnewsArticles)
        console.log(`[News API] Fetched ${gnewsArticles.length} articles from GNews`)
      } catch (error) {
        console.error('[News API] GNews fetch failed:', error)
        // Continue with other sources
      }
    }

    // 2. Fetch from regional scrapers (always for Azerbaijan news)
    if (!country || country === 'az') {
      try {
        const regionalSources = ['azertac', 'trend']
        const scrapedArticles = await scraperManager.scrapeAll(regionalSources)

        const transformedScraped = scrapedArticles.map((article, index) => ({
          id: allArticles.length + index + 1,
          title: article.title,
          summary: article.summary,
          category: article.category || 'general',
          region: 'central-asia',
          countries: ['azerbaijan'],
          impact: 'high',
          source: getSourceName(article.sourceUrl),
          date: new Date(article.publishedDate).toISOString().split('T')[0],
          aiInsight: '',
          rootCause: '',
          confidence: 0,
          predictions: null,
          keyIndicators: extractKeywords(article.title, article.summary),
          readTime: Math.ceil((article.content?.length || 500) / 200),
          language: detectLanguage(article.sourceUrl),
          publishedDate: article.publishedDate,
          sourceUrl: article.sourceUrl,
          author: article.author,
          imageUrl: article.imageUrl,
          fullContent: article.content,
          fullHtmlContent: article.content,
        }))

        allArticles.push(...transformedScraped)
        console.log(`[News API] Fetched ${transformedScraped.length} articles from regional scrapers`)
      } catch (error) {
        console.error('[News API] Regional scraper failed:', error)
        // Continue with GNews articles
      }
    }

    // 3. Save articles to database for caching
    if (allArticles.length > 0) {
      try {
        const articlesToSave = allArticles.map(article => ({
          title: article.title,
          summary: article.summary,
          fullContent: article.fullContent,
          category: article.category,
          region: article.region,
          countries: article.countries,
          impact: article.impact,
          source: article.source,
          sourceUrl: article.sourceUrl,
          author: article.author,
          imageUrl: article.imageUrl,
          publishedDate: article.publishedDate,
          aiInsight: article.aiInsight,
          rootCause: article.rootCause,
          confidence: article.confidence,
          predictions: article.predictions,
          keyIndicators: article.keyIndicators,
          language: article.language,
          readTime: article.readTime,
        }))

        await articleService.saveArticles(articlesToSave)
        console.log(`[News API] Saved ${allArticles.length} articles to database`)
      } catch (error) {
        console.error('[News API] Failed to save articles to database:', error)
        // Continue - serving articles even if saving fails
      }
    }

    // 4. Return articles
    return NextResponse.json({
      success: true,
      source: 'api',
      articles: allArticles.slice(0, limit),
      count: allArticles.length,
    })

  } catch (error) {
    console.error('[News API] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch news',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

// Helper: Transform DB article to API format
function transformDbArticle(article: any) {
  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    category: article.category,
    region: article.region,
    countries: article.countries,
    impact: article.impact,
    source: article.source,
    date: new Date(article.publishedDate).toISOString().split('T')[0],
    aiInsight: article.aiInsight || '',
    rootCause: article.rootCause || '',
    confidence: article.confidence || 0,
    predictions: article.predictions ? JSON.parse(article.predictions) : null,
    keyIndicators: article.keyIndicators || [],
    readTime: article.readTime || 3,
    language: article.language,
    publishedDate: article.publishedDate,
    sourceUrl: article.sourceUrl,
    author: article.author,
    imageUrl: article.imageUrl,
    fullContent: article.fullContent,
    fullHtmlContent: article.fullContent,
  }
}

// Helper: Map frontend category to GNews category
function mapCategory(category: string): string {
  const mapping: Record<string, string> = {
    technology: 'technology',
    economy: 'business',
    energy: 'business',
    health: 'health',
    politics: 'nation',
    sports: 'sports',
    entertainment: 'entertainment',
    science: 'science',
  }
  return mapping[category] || 'general'
}

// Helper: Get source name from URL
function getSourceName(url: string): string {
  if (url.includes('azertac')) return 'Azertac'
  if (url.includes('trend.az')) return 'Trend News Agency'
  if (url.includes('bloomberg')) return 'Bloomberg'
  if (url.includes('bbc')) return 'BBC News'
  if (url.includes('reuters')) return 'Reuters'
  return 'Unknown Source'
}

// Helper: Detect language from URL
function detectLanguage(url: string): string {
  if (url.includes('/en')) return 'en'
  if (url.includes('azertac.az') && !url.includes('/en')) return 'az'
  return 'en'
}

// Helper: Extract keywords
function extractKeywords(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase()
  const keywords = ['market', 'economy', 'technology', 'energy', 'policy', 'trade', 'security']
  return keywords.filter(k => text.includes(k)).map(k => k.charAt(0).toUpperCase() + k.slice(1))
}
