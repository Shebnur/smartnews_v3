/**
 * GNews API Service
 * Documentation: https://gnews.io/docs/v4
 */

// GNews API Response Types
export interface GNewsArticle {
  title: string
  description: string
  content: string
  url: string
  image: string | null
  publishedAt: string
  source: {
    name: string
    url: string
  }
}

export interface GNewsResponse {
  totalArticles: number
  articles: GNewsArticle[]
}

export interface GNewsSearchParams {
  q?: string // Search query
  lang?: string // Language (en, es, fr, etc.)
  country?: string // Country code (us, gb, etc.)
  max?: number // Max results (1-100)
  in?: string // Search in (title, description, content)
  nullable?: string[] // Nullable fields
  from?: string // From date (ISO 8601)
  to?: string // To date (ISO 8601)
  sortby?: 'publishedAt' | 'relevance'
  page?: number // Page number
}

export interface GNewsTopHeadlinesParams {
  category?: 'general' | 'world' | 'nation' | 'business' | 'technology' | 'entertainment' | 'sports' | 'science' | 'health'
  lang?: string
  country?: string
  max?: number
  nullable?: string[]
  from?: string
  to?: string
  page?: number
}

class GNewsService {
  private apiKey: string
  private baseUrl = 'https://gnews.io/api/v4'

  constructor() {
    const apiKey = process.env.GNEWS_API_KEY
    if (!apiKey) {
      throw new Error('GNEWS_API_KEY is not set in environment variables')
    }
    this.apiKey = apiKey
  }

  /**
   * Fetch top headlines
   */
  async getTopHeadlines(params: GNewsTopHeadlinesParams = {}): Promise<GNewsResponse> {
    const queryParams = new URLSearchParams({
      token: this.apiKey,
      ...this.buildQueryParams(params),
    })

    const url = `${this.baseUrl}/top-headlines?${queryParams}`

    try {
      console.log('[GNews] Fetching top headlines:', { params })
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`GNews API error: ${response.status} - ${error.error || error.message || 'Unknown error'}`)
      }

      const data: GNewsResponse = await response.json()
      console.log('[GNews] Fetched articles:', data.totalArticles)
      return data
    } catch (error) {
      console.error('[GNews] Error fetching top headlines:', error)
      throw error
    }
  }

  /**
   * Search for articles
   */
  async searchArticles(params: GNewsSearchParams): Promise<GNewsResponse> {
    if (!params.q) {
      throw new Error('Search query (q) is required')
    }

    const queryParams = new URLSearchParams({
      token: this.apiKey,
      ...this.buildQueryParams(params),
    })

    const url = `${this.baseUrl}/search?${queryParams}`

    try {
      console.log('[GNews] Searching articles:', { params })
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`GNews API error: ${response.status} - ${error.error || error.message || 'Unknown error'}`)
      }

      const data: GNewsResponse = await response.json()
      console.log('[GNews] Found articles:', data.totalArticles)
      return data
    } catch (error) {
      console.error('[GNews] Error searching articles:', error)
      throw error
    }
  }

  /**
   * Build query parameters object
   */
  private buildQueryParams(params: Record<string, any>): Record<string, string> {
    const queryParams: Record<string, string> = {}

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams[key] = value.join(',')
        } else {
          queryParams[key] = String(value)
        }
      }
    })

    return queryParams
  }

  /**
   * Transform GNews article to our application format
   */
  transformArticle(article: GNewsArticle, index: number = 0) {
    return {
      id: index + 1,
      title: article.title,
      summary: article.description || article.content?.slice(0, 200) || '',
      category: this.determineCategory(article.title, article.description),
      region: 'global',
      countries: ['global'],
      impact: 'high',
      source: article.source.name,
      date: new Date(article.publishedAt).toISOString().split('T')[0],
      aiInsight: '', // Will be enhanced later with real AI
      rootCause: '', // Will be enhanced later with real AI
      confidence: 0,
      predictions: null,
      keyIndicators: this.extractKeywords(article.title, article.description),
      readTime: Math.ceil((article.content?.length || 500) / 200),
      language: 'en',
      publishedDate: article.publishedAt,
      sourceUrl: article.url,
      author: article.source.name,
      imageUrl: article.image,
      fullContent: article.content,
      fullHtmlContent: article.content,
    }
  }

  /**
   * Determine article category from title/description
   */
  private determineCategory(title: string, description: string = ''): string {
    const text = `${title} ${description}`.toLowerCase()

    if (text.match(/tech|ai|software|digital|cyber|startup/)) return 'technology'
    if (text.match(/business|economy|market|trade|finance|stock/)) return 'economy'
    if (text.match(/energy|oil|gas|renewable|climate/)) return 'energy'
    if (text.match(/health|medical|hospital|disease|vaccine/)) return 'health'
    if (text.match(/politics|government|election|policy/)) return 'politics'
    if (text.match(/sports|football|basketball|olympics/)) return 'sports'
    if (text.match(/entertainment|movie|music|celebrity/)) return 'entertainment'
    if (text.match(/science|research|study|discovery/)) return 'science'

    return 'general'
  }

  /**
   * Extract keywords from title and description
   */
  private extractKeywords(title: string, description: string = ''): string[] {
    const text = `${title} ${description}`.toLowerCase()
    const keywords = ['market', 'economy', 'technology', 'energy', 'policy', 'trade', 'security', 'health', 'climate']
    return keywords.filter(k => text.includes(k)).map(k => k.charAt(0).toUpperCase() + k.slice(1))
  }
}

// Export singleton instance
export const gnewsService = new GNewsService()
