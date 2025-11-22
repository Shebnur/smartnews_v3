import { BaseScraper, ScrapedArticle } from './BaseScraper';

export class BloombergScraper extends BaseScraper {
  constructor() {
    super('Bloomberg');
  }
  
  async scrape(): Promise<ScrapedArticle[]> {
    const url = 'https://www.bloomberg.com/';
    
    // Bloomberg has anti-scraping, so we need to use Puppeteer
    // For now, RSS feed is easier
    const rssUrl = 'https://feeds.bloomberg.com/markets/news.rss';
    
    try {
      const html = await this.fetchHTML(rssUrl);
      const $ = this.loadHTML(html);
      
      const articles: ScrapedArticle[] = [];
      
      $('item').each((i, element) => {
        const $el = $(element);
        
        const title = this.cleanText($el.find('title').text());
        const link = $el.find('link').text();
        const summary = this.cleanText($el.find('description').text());
        const date = $el.find('pubDate').text();
        
        if (title && link) {
          articles.push({
            title,
            summary: summary.replace(/<[^>]*>/g, ''), // Remove HTML tags
            content: summary,
            sourceUrl: link,
            publishedDate: date || new Date().toISOString(),
            category: 'economy'
          });
        }
      });
      
      return articles.slice(0, 20);
    } catch (error) {
      console.error('Error scraping Bloomberg:', error);
      return [];
    }
  }
}
