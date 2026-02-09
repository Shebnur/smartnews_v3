import React from 'react';

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  region: string;
  countries: string[];
  impact: string;
  source: string;
  date: string;
  aiInsight: string;
  rootCause: string;
  confidence: number;
  predictions: {
    [key: string]: {
      trend: string;
      value: number;
      description: string;
    };
  };
  keyIndicators: string[];
  readTime: number;
  language?: string;
  publishedDate?: string;
  sourceUrl?: string;
  fullContent?: string;
  fullHtmlContent?: string;
  author?: string;
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface Filters {
  timeRange: string;
  regions: string[];
  countries: string[];
  categories: string[];
  languages: string[];
  sources: string[];
  customTopic: string;
  customCategory: string;
  dateFrom: string;
  dateTo: string;
  useCustomDate: boolean;
}

export type FilterArrayKey = 'regions' | 'countries' | 'categories' | 'languages' | 'sources';
export type ShowFilterKey = 'regions' | 'countries' | 'categories' | 'sources' | 'languages';

export interface Metric {
  label: string;
  value: string | number;
  change: string;
  trend: string;
  icon: React.ElementType;
  color: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
}
