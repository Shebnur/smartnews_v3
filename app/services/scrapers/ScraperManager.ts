import { AzertacScraper } from './AzertacScraper';
import { TrendNewsScraper } from './TrendNewsScraper';
import { BloombergScraper } from './BloombergScraper';
import { BBCScraper } from './BBCScraper';
import { ReutersScraper } from './ReutersScraper';
import { ScrapedArticle } from './BaseScraper';

export class ScraperManager {
  private scrapers = {
    azertac: new AzertacScraper(),
    trend: new TrendNewsScraper(),
    bloomberg: new BloombergScraper(),
    bbc: new BBCScraper(),
    reuters: new ReutersScraper(),
  };
  
  async scrapeAll(sources?: string[]): Promise<ScrapedArticle[]> {
    const sourcesToScrape = sources || Object.keys(this.scrapers);
    const results: ScrapedArticle[] = [];
    
    // Scrape in parallel
    const promises = sourcesToScrape.map(async (source) => {
      try {
        const scraper = this.scrapers[source as keyof typeof this.scrapers];
        if (scraper) {
          return await scraper.scrape();
        }
        return [];
      } catch (error) {
        console.error(`Error scraping ${source}:`, error);
        return [];
      }
    });
    
    const allResults = await Promise.all(promises);
    
    // Flatten and deduplicate
    allResults.forEach(articles => {
      results.push(...articles);
    });
    
    // Sort by date (newest first)
    return results.sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  }
  
  async scrapeSource(source: string): Promise<ScrapedArticle[]> {
    const scraper = this.scrapers[source as keyof typeof this.scrapers];
    if (!scraper) {
      throw new Error(`Scraper for ${source} not found`);
    }
    return await scraper.scrape();
  }
}