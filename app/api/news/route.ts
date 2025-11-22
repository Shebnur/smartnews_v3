import { NextRequest, NextResponse } from 'next/server';
import { ScraperManager } from '@/app/services/scrapers/ScraperManager';

const scraperManager = new ScraperManager();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const sources = searchParams.get('sources')?.split(',') || undefined;
  const country = searchParams.get('country') || '';
  const category = searchParams.get('category') || '';
  
  try {
    // Scrape news from selected sources
    let articles = await scraperManager.scrapeAll(sources);
    
    // Filter by country if specified
    if (country) {
      // Filter logic based on source or content
      articles = articles.filter(article => {
        if (country === 'az') {
          return article.sourceUrl.includes('azertac') || 
                 article.sourceUrl.includes('trend.az');
        }
        return true;
      });
    }
    
    // Transform to your NewsArticle format
    const transformedArticles = articles.map((article, index) => ({
      id: index + 1,
      title: article.title,
      summary: article.summary,
      category: article.category || determineCategory(article.title),
      region: determineRegion(article.sourceUrl),
      countries: [determineCountry(article.sourceUrl)],
      impact: determineImpact(article.title),
      source: getSourceName(article.sourceUrl),
      date: new Date(article.publishedDate).toISOString().split('T')[0],
      aiInsight: generateInsight(article.title, article.summary),
      rootCause: generateRootCause(article.title),
      confidence: 0.85,
      predictions: generatePredictions(),
      keyIndicators: extractKeywords(article.title, article.summary),
      readTime: Math.ceil((article.content?.length || 500) / 200),
      language: detectLanguage(article.sourceUrl),
      publishedDate: article.publishedDate,
      sourceUrl: article.sourceUrl,
      author: article.author,
      imageUrl: article.imageUrl,
      fullContent: article.content,
      fullHtmlContent: article.content
    }));
    
    return NextResponse.json({ 
      success: true, 
      articles: transformedArticles,
      count: transformedArticles.length 
    });
    
  } catch (error) {
    console.error('Error scraping news:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to scrape news',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions
function getSourceName(url: string): string {
  if (url.includes('azertac')) return 'Azertac';
  if (url.includes('trend.az')) return 'Trend News Agency';
  if (url.includes('bloomberg')) return 'Bloomberg';
  if (url.includes('bbc')) return 'BBC News';
  if (url.includes('reuters')) return 'Reuters';
  return 'Unknown Source';
}

function determineCategory(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('tech') || lower.includes('ai')) return 'technology';
  if (lower.includes('business') || lower.includes('market')) return 'economy';
  if (lower.includes('energy') || lower.includes('oil')) return 'energy';
  if (lower.includes('health')) return 'health';
  return 'general';
}

function determineRegion(url: string): string {
  if (url.includes('azertac') || url.includes('trend.az')) return 'central-asia';
  if (url.includes('bbc') || url.includes('reuters')) return 'global';
  return 'global';
}

function determineCountry(url: string): string {
  if (url.includes('azertac') || url.includes('trend.az')) return 'azerbaijan';
  return 'global';
}

function determineImpact(title: string): string {
  const keywords = ['historic', 'breakthrough', 'major', 'critical'];
  return keywords.some(k => title.toLowerCase().includes(k)) ? 'critical' : 'high';
}

function detectLanguage(url: string): string {
  if (url.includes('/en')) return 'en';
  if (url.includes('azertac.az') && !url.includes('/en')) return 'az';
  return 'en';
}

function generateInsight(title: string, summary: string): string {
  return `AI Analysis: ${summary.slice(0, 150)}... This development shows significant implications for ${determineCategory(title)} sector.`;
}

function generateRootCause(title: string): string {
  return `Analysis suggests this ${determineCategory(title)} development stems from recent market dynamics and strategic positioning.`;
}

function generatePredictions() {
  return {
    '3m': { trend: 'up', value: 15, description: 'Short-term positive trajectory expected' },
    '6m': { trend: 'stable', value: 10, description: 'Mid-term stabilization anticipated' },
    '12m': { trend: 'up', value: 25, description: 'Long-term growth trajectory likely' }
  };
}

function extractKeywords(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const keywords = ['market', 'economy', 'technology', 'energy', 'policy'];
  return keywords.filter(k => text.includes(k)).map(k => k.charAt(0).toUpperCase() + k.slice(1));
}