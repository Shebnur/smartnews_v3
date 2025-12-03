# 🤖 AI News Agent - User Guide

## Overview

The AI News Agent is an intelligent assistant that helps you find news articles using natural language. Instead of manually selecting filters, simply tell the AI what kind of news you want to read, and it will automatically create the right filters and search for relevant articles.

## Features

✅ **Natural Language Understanding** - Talk to the AI like you would to a human
✅ **Automatic Filter Generation** - AI creates filters based on your request
✅ **Smart Date Parsing** - Understands "last week", "past 10 days", etc.
✅ **Category Detection** - Automatically identifies topics (sports, tech, politics, etc.)
✅ **Keyword Extraction** - Finds relevant search terms from your request
✅ **Real-time Search** - Instantly searches news with generated filters
✅ **Beautiful Chat Interface** - Clean, modern UI with filter visualization

## How to Use

### 1. Open the AI Agent

Click the **purple floating button** with the robot icon in the bottom-right corner of the page.

### 2. Ask for News

Simply type what you want in natural language. Examples:

**Example 1: Sports News**
```
User: I want to read football news from the last 10 days
```
AI will:
- Set category: `sports`
- Set date range: Last 10 days
- Add keywords: `football`, `soccer`
- Search and return matching articles

**Example 2: Technology News**
```
User: Show me tech news about AI from this week
```
AI will:
- Set category: `technology`
- Add keywords: `AI`, `artificial intelligence`
- Set date range: Last 7 days
- Search and return results

**Example 3: Business News**
```
User: Get me economic news from Bloomberg
```
AI will:
- Set category: `economy`
- Set source: `bloomberg`
- Search and return articles

**Example 4: Regional News**
```
User: What's happening in Azerbaijan lately?
```
AI will:
- Set country: `azerbaijan`
- Set sources: `azertac`, `trend.az`
- Set date range: Recent (last few days)
- Search local news

### 3. View Results

The AI will:
1. Show you the filters it applied (category, date range, sources, etc.)
2. Display the number of articles found
3. Automatically update the main news feed with the found articles

## Supported Filters

### Categories
- `technology` - Tech, AI, software, hardware
- `economy` - Business, markets, finance
- `sports` - Football, basketball, Olympics, etc.
- `politics` - Government, elections, policy
- `energy` - Oil, gas, renewables
- `health` - Medicine, healthcare, wellness
- `general` - Other news

### News Sources
- `azertac` - Azertac News Agency
- `trend.az` - Trend News Agency
- `bbc` - BBC News
- `reuters` - Reuters
- `bloomberg` - Bloomberg

### Countries/Regions
- `azerbaijan` - Local Azerbaijani news
- `global` - International news
- `us` - United States
- `uk` - United Kingdom
- `eu` - European Union

### Date Ranges
The AI understands:
- "last 10 days"
- "past week"
- "this week"
- "last month"
- "recent" (defaults to 3-7 days)
- "today"
- "yesterday"

## Example Conversations

### Example 1: Quick Sports Check
```
You: Football news from yesterday

AI: Searching for sports news from the last 1 day, focusing on football

Filters Applied:
📁 Category: sports
📅 Last 1 day
🏷️ Keywords: football

✓ Found 5 articles
```

### Example 2: Technology Research
```
You: I need to read about artificial intelligence developments this month

AI: Searching for technology news from the last 30 days, focusing on AI

Filters Applied:
📁 Category: technology
📅 Last 30 days
🏷️ Keywords: artificial intelligence, AI, machine learning

✓ Found 23 articles
```

### Example 3: Local News
```
You: What's the latest news from Azerbaijan?

AI: Searching for news from Azerbaijan from recent days

Filters Applied:
🌍 Country: azerbaijan
📰 Sources: azertac, trend.az
📅 Last 3 days

✓ Found 12 articles
```

### Example 4: Specific Topic
```
You: Show me energy sector news about oil prices from the past 2 weeks

AI: Searching for energy news from the last 14 days, focusing on oil prices

Filters Applied:
📁 Category: energy
📅 Last 14 days
🏷️ Keywords: oil, prices, crude

✓ Found 8 articles
```

## Tips for Best Results

### ✅ Do:
- Be specific about what you want
- Mention time periods if relevant
- Use common terms (football vs soccer)
- Combine multiple criteria

### ❌ Don't:
- Use overly complex sentences
- Mix multiple unrelated topics
- Expect articles older than what's in the database
- Use very obscure terminology

## How It Works

### Behind the Scenes

1. **Your Request** → You type a natural language query
2. **AI Analysis** → Claude AI analyzes your request
3. **Filter Extraction** → AI identifies:
   - Category (tech, sports, etc.)
   - Date range (last week, etc.)
   - Sources (BBC, Reuters, etc.)
   - Keywords (important terms)
   - Country (Azerbaijan, US, etc.)
4. **Search Execution** → System searches news with filters
5. **Date Filtering** → Articles filtered by date range
6. **Keyword Matching** → Results filtered by keywords
7. **Results Display** → Articles shown in main feed

### Technology Stack

- **Frontend**: React component with beautiful UI
- **AI Engine**: Claude 3.5 Sonnet (Anthropic)
- **API**: Next.js API route
- **Search**: Existing news scraper with filters

## Troubleshooting

### No Articles Found
**Possible causes:**
- Date range too narrow
- Too specific keywords
- Source doesn't have that type of news

**Solutions:**
- Broaden the date range
- Use more general terms
- Try different sources

### AI Didn't Understand
**Possible causes:**
- Very complex or ambiguous request
- Mixing multiple unrelated topics

**Solutions:**
- Simplify your request
- Focus on one topic at a time
- Use clearer time expressions

### Wrong Filters Applied
**Possible causes:**
- Ambiguous terminology
- AI misinterpretation

**Solutions:**
- Rephrase your request
- Be more explicit
- Mention specific filters you want

## API Integration

### Endpoint
```
POST /api/ai-agent
```

### Request Body
```json
{
  "message": "Your natural language request"
}
```

### Response Format
```json
{
  "success": true,
  "filters": {
    "category": "sports",
    "dateRange": {
      "daysAgo": 10
    },
    "keywords": ["football"]
  },
  "summary": "Searching for sports news from the last 10 days, focusing on football",
  "searchQuery": "football sports news",
  "articles": [...],
  "count": 15
}
```

## Environment Setup

### Required Environment Variables

```bash
# Anthropic API Key for Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get your API key from: https://console.anthropic.com/

### Installation

1. Install dependencies:
```bash
npm install @anthropic-ai/sdk
```

2. Add API key to `.env`:
```
ANTHROPIC_API_KEY=your-key-here
```

3. Restart the development server

## Privacy & Data

- **No Data Storage**: Conversations are not stored
- **No Personal Info**: AI only processes news requests
- **Secure API**: Anthropic API calls are server-side only
- **No Tracking**: User queries are not logged or analyzed

## Future Enhancements

Planned features:
- 📊 **Advanced Analytics** - Show trends from search results
- 🔔 **Save Searches** - Save frequent queries for quick access
- 📧 **Email Alerts** - Get notified when new articles match your query
- 🌐 **Multi-language** - Support for queries in multiple languages
- 🎯 **Smart Suggestions** - AI suggests related searches
- 📚 **Search History** - View and repeat past successful searches

## Support

Having issues?
- Check the console for error messages
- Ensure ANTHROPIC_API_KEY is set correctly
- Verify news sources are responding
- Try simpler queries first

---

**Enjoy your AI-powered news search! 🚀**
