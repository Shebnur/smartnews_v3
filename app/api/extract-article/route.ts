import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract article content (basic extraction)
    let content = '';
    let author = '';

    // Try to find author
    author = $('meta[name="author"]').attr('content') ||
             $('meta[property="article:author"]').attr('content') ||
             '';

    // Try to find main content
    let articleElement = $('article').first();
    if (articleElement.length === 0) {
      articleElement = $('.article-body, .article-content, main').first();
    }

    if (articleElement.length > 0) {
      // Remove scripts, styles, ads
      articleElement.find('script, style, iframe, .ad, .advertisement').remove();
      content = articleElement.html() || '';
    } else {
      // Fallback: get all paragraphs
      const paragraphs = $('p');
      const textParagraphs: string[] = [];
      paragraphs.each((_, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 50) {
          textParagraphs.push(text);
        }
      });
      content = textParagraphs.join('\n\n');
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