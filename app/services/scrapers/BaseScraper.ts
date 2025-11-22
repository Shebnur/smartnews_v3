import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  title: string;
  summary: string;
  content: string;
  author?: string;
  publishedDate: string;
  sourceUrl: string;
  imageUrl?: string;
  category?: string;
}

export abstract class BaseScraper {
  protected source: string;
  
  constructor(source: string) {
    this.source = source;
  }
  
  abstract scrape(url?: string): Promise<ScrapedArticle[]>;
  
  protected async fetchHTML(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }
  
  protected loadHTML(html: string) {
    return cheerio.load(html);
  }
  
  protected cleanText(text: string): string {
    return text.trim().replace(/\s+/g, ' ').replace(/\n+/g, ' ');
  }
}