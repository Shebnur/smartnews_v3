import { BaseScraper, ScrapedArticle } from './BaseScraper';

export class TrendNewsScraper extends BaseScraper {
  constructor() {
    super('Trend News Agency');
  }
  
  async scrape(): Promise<ScrapedArticle[]> {
    const url = 'https://en.trend.az/';
    const html = await this.fetchHTML(url);
    const $ = this.loadHTML(html);
    
    const articles: ScrapedArticle[] = [];
    
    $('.news, .block_news, article').each((i, element) => {
      const $el = $(element);
      
      const title = this.cleanText($el.find('h3, h2, .title').first().text());
      const link = $el.find('a').first().attr('href');
      const summary = this.cleanText($el.find('p').first().text());
      const date = $el.find('.date, time, .time').first().text();
      const image = $el.find('img').first().attr('src');
      
      if (title && link) {
        articles.push({
          title,
          summary: summary || title.slice(0, 150),
          content: summary,
          sourceUrl: link.startsWith('http') ? link : `https://en.trend.az${link}`,
          publishedDate: date || new Date().toISOString(),
          imageUrl: image,
          category: 'general'
        });
      }
    });
    
    return articles.slice(0, 20);
  }
}