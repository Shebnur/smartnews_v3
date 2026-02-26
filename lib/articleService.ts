/**
 * Article Service - Database operations for articles
 */

import { prisma } from './prisma'

export interface SaveArticleData {
  title: string
  summary: string
  fullContent?: string
  category: string
  region: string
  countries: string[]
  impact: string
  source: string
  sourceUrl: string
  author?: string
  imageUrl?: string
  publishedDate: Date | string
  aiInsight?: string
  rootCause?: string
  confidence?: number
  predictions?: any
  keyIndicators?: string[]
  language?: string
  readTime?: number
}

export interface GetArticlesOptions {
  category?: string
  region?: string
  source?: string
  language?: string
  limit?: number
  offset?: number
  fromDate?: Date
  toDate?: Date
}

class ArticleService {
  /**
   * Save article to database (with deduplication by URL)
   */
  async saveArticle(data: SaveArticleData) {
    try {
      const publishedDate = typeof data.publishedDate === 'string'
        ? new Date(data.publishedDate)
        : data.publishedDate

      // Try to upsert - create if doesn't exist, update if exists
      const article = await prisma.article.upsert({
        where: { sourceUrl: data.sourceUrl },
        update: {
          title: data.title,
          summary: data.summary,
          fullContent: data.fullContent,
          category: data.category,
          region: data.region,
          countries: data.countries,
          impact: data.impact,
          source: data.source,
          author: data.author,
          imageUrl: data.imageUrl,
          publishedDate,
          aiInsight: data.aiInsight,
          rootCause: data.rootCause,
          confidence: data.confidence,
          predictions: data.predictions ? JSON.stringify(data.predictions) : null,
          keyIndicators: data.keyIndicators || [],
          language: data.language || 'en',
          readTime: data.readTime,
        },
        create: {
          title: data.title,
          summary: data.summary,
          fullContent: data.fullContent,
          category: data.category,
          region: data.region,
          countries: data.countries,
          impact: data.impact,
          source: data.source,
          sourceUrl: data.sourceUrl,
          author: data.author,
          imageUrl: data.imageUrl,
          publishedDate,
          aiInsight: data.aiInsight,
          rootCause: data.rootCause,
          confidence: data.confidence,
          predictions: data.predictions ? JSON.stringify(data.predictions) : null,
          keyIndicators: data.keyIndicators || [],
          language: data.language || 'en',
          readTime: data.readTime,
        },
      })

      return article
    } catch (error) {
      console.error('[ArticleService] Error saving article:', error)
      throw error
    }
  }

  /**
   * Save multiple articles in batch
   */
  async saveArticles(articles: SaveArticleData[]) {
    const savedArticles = []
    const errors = []

    for (const article of articles) {
      try {
        const saved = await this.saveArticle(article)
        savedArticles.push(saved)
      } catch (error) {
        errors.push({ article: article.sourceUrl, error })
        console.error(`[ArticleService] Failed to save article: ${article.sourceUrl}`, error)
      }
    }

    console.log(`[ArticleService] Saved ${savedArticles.length}/${articles.length} articles`)
    if (errors.length > 0) {
      console.warn(`[ArticleService] ${errors.length} articles failed to save`)
    }

    return { savedArticles, errors }
  }

  /**
   * Get articles from database with filters
   */
  async getArticles(options: GetArticlesOptions = {}) {
    const {
      category,
      region,
      source,
      language,
      limit = 50,
      offset = 0,
      fromDate,
      toDate,
    } = options

    try {
      const where: any = {}

      if (category) where.category = category
      if (region) where.region = region
      if (source) where.source = source
      if (language) where.language = language

      if (fromDate || toDate) {
        where.publishedDate = {}
        if (fromDate) where.publishedDate.gte = fromDate
        if (toDate) where.publishedDate.lte = toDate
      }

      const articles = await prisma.article.findMany({
        where,
        orderBy: { publishedDate: 'desc' },
        take: limit,
        skip: offset,
      })

      return articles
    } catch (error) {
      console.error('[ArticleService] Error getting articles:', error)
      throw error
    }
  }

  /**
   * Get recent articles (last 24 hours)
   */
  async getRecentArticles(limit: number = 50) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return this.getArticles({
      fromDate: oneDayAgo,
      limit,
    })
  }

  /**
   * Check if we have fresh articles (less than 1 hour old)
   */
  async hasFreshArticles(maxAgeMinutes: number = 60): Promise<boolean> {
    const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60 * 1000)

    const count = await prisma.article.count({
      where: {
        fetchedAt: {
          gte: cutoffTime,
        },
      },
    })

    return count > 0
  }

  /**
   * Get article count by category
   */
  async getArticleStats() {
    try {
      const categories = await prisma.article.groupBy({
        by: ['category'],
        _count: true,
      })

      const sources = await prisma.article.groupBy({
        by: ['source'],
        _count: true,
      })

      const total = await prisma.article.count()

      return {
        total,
        byCategory: categories,
        bySource: sources,
      }
    } catch (error) {
      console.error('[ArticleService] Error getting article stats:', error)
      throw error
    }
  }

  /**
   * Delete old articles (older than X days)
   */
  async deleteOldArticles(daysToKeep: number = 30) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)

    try {
      const result = await prisma.article.deleteMany({
        where: {
          publishedDate: {
            lt: cutoffDate,
          },
        },
      })

      console.log(`[ArticleService] Deleted ${result.count} old articles`)
      return result.count
    } catch (error) {
      console.error('[ArticleService] Error deleting old articles:', error)
      throw error
    }
  }
}

// Export singleton instance
export const articleService = new ArticleService()
