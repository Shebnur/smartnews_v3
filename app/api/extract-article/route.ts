import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
  }

  try {
    // Method 1: Using JSDOM (install: npm install jsdom)
    const { JSDOM } = require('jsdom');
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Extract article content (basic extraction)
    let content = '';
    let author = '';
    
    // Try to find author
    const authorMeta = document.querySelector('meta[name="author"]') || 
                       document.querySelector('meta[property="article:author"]');
    if (authorMeta) {
      author = authorMeta.getAttribute('content') || '';
    }
    
    // Try to find main content
    const article = document.querySelector('article') || 
                   document.querySelector('.article-body') ||
                   document.querySelector('.article-content') ||
                   document.querySelector('main');
    
    if (article) {
      // Remove scripts, styles, ads
      const unwanted = article.querySelectorAll('script, style, iframe, .ad, .advertisement');
      unwanted.forEach((el: Element) => el.remove());
      
      content = article.innerHTML;
    } else {
      // Fallback: get all paragraphs
      const paragraphs = document.querySelectorAll('p');
      content = Array.from<Element>(paragraphs)
        .map((p) => p.textContent)
        .filter((text): text is string => text !== null && text.length > 50)
        .join('\n\n');
    }
    
    return NextResponse.json({
      success: true,
      content: content.replace(/<[^>]*>/g, ''), // Plain text
      html: content, // HTML content
      author
    });
    
  } catch (error) {
    console.error('Error extracting article:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to extract article content'
    }, { status: 500 });
  }
}