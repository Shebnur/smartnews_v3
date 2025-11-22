import { BaseScraper, ScrapedArticle } from './BaseScraper';
export class ReutersScraper extends BaseScraper {
  constructor() {
    super('Reuters');
  }
  
  async scrape(): Promise<ScrapedArticle[]> {
    const url = 'https://www.reuters.com/world/';
    const html = await this.fetchHTML(url);
    const $ = this.loadHTML(html);
    
    const articles: ScrapedArticle[] = [];
    
    $('[data-testid="MediaStoryCard"], article').each((i, element) => {
      const $el = $(element);
      
      const title = this.cleanText($el.find('h3, h2, [data-testid="Heading"]').first().text());
      const link = $el.find('a').first().attr('href');
      const summary = this.cleanText($el.find('p').first().text());
      const image = $el.find('img').first().attr('src');
      
      if (title && link) {
        articles.push({
          title,
          summary: summary || title.slice(0, 150),
          content: summary,
          sourceUrl: link.startsWith('http') ? link : `https://www.reuters.com${link}`,
          publishedDate: new Date().toISOString(),
          imageUrl: image,
          category: 'general'
        });
      }
    });
    
    return articles.slice(0, 20);
  }
}