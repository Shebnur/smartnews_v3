import { BaseScraper, ScrapedArticle } from './BaseScraper';

export class BBCScraper extends BaseScraper {
  constructor() {
    super('BBC News');
  }
  
  async scrape(): Promise<ScrapedArticle[]> {
    const url = 'https://www.bbc.com/news';
    const html = await this.fetchHTML(url);
    const $ = this.loadHTML(html);
    
    const articles: ScrapedArticle[] = [];
    
    $('article, [data-testid="card-headline"]').each((i, element) => {
      const $el = $(element);
      
      const title = this.cleanText($el.find('h2, h3, [data-testid="card-headline"]').first().text());
      const link = $el.find('a').first().attr('href');
      const summary = this.cleanText($el.find('p').first().text());
      const image = $el.find('img').first().attr('src');
      
      if (title && link) {
        articles.push({
          title,
          summary: summary || title.slice(0, 150),
          content: summary,
          sourceUrl: link.startsWith('http') ? link : `https://www.bbc.com${link}`,
          publishedDate: new Date().toISOString(),
          imageUrl: image,
          category: 'general'
        });
      }
    });
    
    return articles.slice(0, 20);
  }
}