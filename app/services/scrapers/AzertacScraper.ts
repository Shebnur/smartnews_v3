import { BaseScraper, ScrapedArticle } from './BaseScraper';

export class AzertacScraper extends BaseScraper {
  constructor() {
    super('Azertac');
  }
  
  async scrape(): Promise<ScrapedArticle[]> {
    const url = 'https://azertac.az/en';
    const html = await this.fetchHTML(url);
    const $ = this.loadHTML(html);
    
    const articles: ScrapedArticle[] = [];
    
    // Azertac specific selectors
    $('.news-item, .article-item').each((i, element) => {
      const $el = $(element);
      
      const title = this.cleanText($el.find('h2, h3, .title').first().text());
      const link = $el.find('a').first().attr('href');
      const summary = this.cleanText($el.find('p, .summary').first().text());
      const date = $el.find('.date, time').first().text();
      const image = $el.find('img').first().attr('src');
      
      if (title && link) {
        articles.push({
          title,
          summary: summary || title.slice(0, 150),
          content: summary,
          sourceUrl: link.startsWith('http') ? link : `https://azertac.az${link}`,
          publishedDate: date || new Date().toISOString(),
          imageUrl: image?.startsWith('http') ? image : `https://azertac.az${image}`,
          category: 'general'
        });
      }
    });
    
    return articles.slice(0, 20); // Return top 20
  }
  
  async scrapeArticle(url: string): Promise<ScrapedArticle | null> {
    try {
      const html = await this.fetchHTML(url);
      const $ = this.loadHTML(html);
      
      const title = this.cleanText($('h1, .article-title').first().text());
      const content = this.cleanText($('.article-body, .content').text());
      const author = this.cleanText($('.author, .byline').first().text());
      const date = $('.date, time').first().attr('datetime') || new Date().toISOString();
      const image = $('article img, .article-image img').first().attr('src');
      
      return {
        title,
        summary: content.slice(0, 200),
        content,
        author,
        sourceUrl: url,
        publishedDate: date,
        imageUrl: image?.startsWith('http') ? image : `https://azertac.az${image}`,
      };
    } catch (error) {
      console.error('Error scraping article:', error);
      return null;
    }
  }
}