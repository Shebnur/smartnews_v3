"use client";

// Added FC (Functional Component) to the import
import React, { useState, useEffect, useMemo, FC } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Filter, TrendingUp, Globe, BookOpen, DollarSign, Zap, Shield, Heart, Car, Clock, Bell, MessageSquare, ChevronDown, X, Check, ArrowRight, BarChart3, Brain, Mail, Calendar, AlertCircle, TrendingDown, Minus, MapPin, CheckSquare, Square, Bookmark, Share2, ExternalLink, Eye, Sparkles } from 'lucide-react';

// Define the shape of a single news article
interface NewsArticle {
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
    }
  };
  keyIndicators: string[];
  readTime: number;
}

// Define the shape of a chat message
interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

// Define the shape of your filters
interface Filters {
  timeRange: string;
  regions: string[];
  countries: string[];
  categories: string[];
  languages: string[];
  sources: string[];
  customTopic: string;
  dateFrom: string;
  dateTo: string;
  useCustomDate: boolean;
}

// Define types for filter keys
type FilterArrayKey = 'regions' | 'countries' | 'categories' | 'languages' | 'sources';
type ShowFilterKey = 'regions' | 'countries' | 'categories' | 'sources' | 'languages';

// Define type for analytics metrics
interface Metric {
  label: string;
  value: string | number;
  change: string;
  trend: string;
  icon: React.ElementType; // Type for a component like 'Globe'
  color: string;
}

// Define type for country objects
interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
}

// --- COMPONENT START ---

// Correct syntax is: const App: FC = () => {
const App: FC = () => {
  const [filters, setFilters] = useState<Filters>({
    timeRange: '7d',
    regions: [],
    countries: [],
    categories: [],
    languages: ['en'],
    sources: [],
    customTopic: '',
    dateFrom: '',
    dateTo: '',
    useCustomDate: false
  });

  // Added the type for this state
  const [showFilters, setShowFilters] = useState({
    regions: false,
    countries: false,
    categories: false,
    sources: false,
    languages: false
  });

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('news');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedNewsForSubscription, setSelectedNewsForSubscription] = useState<NewsArticle | null>(null);
  const [savedArticles, setSavedArticles] = useState<number[]>([]);
  const [readArticles, setReadArticles] = useState<number[]>([]);

  // Comprehensive regions covering the entire world
  const regions = [
    { id: 'north-america', name: 'North America', emoji: '🌎', countries: 23 },
    { id: 'south-america', name: 'South America', emoji: '🌎', countries: 12 },
    { id: 'europe', name: 'Europe', emoji: '🇪🇺', countries: 44 },
    { id: 'africa', name: 'Africa', emoji: '🌍', countries: 54 },
    { id: 'middle-east', name: 'Middle East', emoji: '🕌', countries: 17 },
    { id: 'central-asia', name: 'Central Asia', emoji: '🏔️', countries: 5 },
    { id: 'south-asia', name: 'South Asia', emoji: '🕉️', countries: 8 },
    { id: 'east-asia', name: 'East Asia', emoji: '🏮', countries: 6 },
    { id: 'southeast-asia', name: 'Southeast Asia', emoji: '🌴', countries: 11 },
    { id: 'oceania', name: 'Oceania', emoji: '🏝️', countries: 14 },
    { id: 'caribbean', name: 'Caribbean', emoji: '🏖️', countries: 13 }
  ];

  // Added type for allCountries
  const allCountries: Record<string, Country[]> = {
    'north-america': [
      { id: 'usa', name: 'United States', code: 'US', flag: '🇺🇸' },
      { id: 'canada', name: 'Canada', code: 'CA', flag: '🇨🇦' },
      { id: 'mexico', name: 'Mexico', code: 'MX', flag: '🇲🇽' },
      { id: 'guatemala', name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
      { id: 'honduras', name: 'Honduras', code: 'HN', flag: '🇭🇳' },
      { id: 'el-salvador', name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
      { id: 'nicaragua', name: 'Nicaragua', code: 'NI', flag: '🇳🇮' },
      { id: 'costa-rica', name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
      { id: 'panama', name: 'Panama', code: 'PA', flag: '🇵🇦' },
      { id: 'belize', name: 'Belize', code: 'BZ', flag: '🇧🇿' }
    ],
    'south-america': [
      { id: 'brazil', name: 'Brazil', code: 'BR', flag: '🇧🇷' },
      { id: 'argentina', name: 'Argentina', code: 'AR', flag: '🇦🇷' },
      { id: 'chile', name: 'Chile', code: 'CL', flag: '🇨🇱' },
      { id: 'colombia', name: 'Colombia', code: 'CO', flag: '🇨🇴' },
      { id: 'peru', name: 'Peru', code: 'PE', flag: '🇵🇪' },
      { id: 'venezuela', name: 'Venezuela', code: 'VE', flag: '🇻🇪' },
      { id: 'ecuador', name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
      { id: 'bolivia', name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
      { id: 'paraguay', name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
      { id: 'uruguay', name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
      { id: 'guyana', name: 'Guyana', code: 'GY', flag: '🇬🇾' },
      { id: 'suriname', name: 'Suriname', code: 'SR', flag: '🇸🇷' }
    ],
    'europe': [
      { id: 'uk', name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
      { id: 'germany', name: 'Germany', code: 'DE', flag: '🇩🇪' },
      { id: 'france', name: 'France', code: 'FR', flag: '🇫🇷' },
      { id: 'italy', name: 'Italy', code: 'IT', flag: '🇮🇹' },
      { id: 'spain', name: 'Spain', code: 'ES', flag: '🇪🇸' },
      { id: 'poland', name: 'Poland', code: 'PL', flag: '🇵🇱' },
      { id: 'romania', name: 'Romania', code: 'RO', flag: '🇷🇴' },
      { id: 'netherlands', name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
      { id: 'belgium', name: 'Belgium', code: 'BE', flag: '🇧🇪' },
      { id: 'greece', name: 'Greece', code: 'GR', flag: '🇬🇷' },
      { id: 'portugal', name: 'Portugal', code: 'PT', flag: '🇵🇹' },
      { id: 'czechia', name: 'Czech Republic', code: 'CZ', flag: '🇨🇿' },
      { id: 'hungary', name: 'Hungary', code: 'HU', flag: '🇭🇺' },
      { id: 'sweden', name: 'Sweden', code: 'SE', flag: '🇸🇪' },
      { id: 'austria', name: 'Austria', code: 'AT', flag: '🇦🇹' },
      { id: 'bulgaria', name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
      { id: 'denmark', name: 'Denmark', code: 'DK', flag: '🇩🇰' },
      { id: 'finland', name: 'Finland', code: 'FI', flag: '🇫🇮' },
      { id: 'norway', name: 'Norway', code: 'NO', flag: '🇳🇴' },
      { id: 'ireland', name: 'Ireland', code: 'IE', flag: '🇮🇪' },
      { id: 'croatia', name: 'Croatia', code: 'HR', flag: '🇭🇷' },
      { id: 'slovakia', name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
      { id: 'lithuania', name: 'Lithuania', code: 'LT', flag: '🇱🇹' },
      { id: 'slovenia', name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
      { id: 'latvia', name: 'Latvia', code: 'LV', flag: '🇱🇻' },
      { id: 'estonia', name: 'Estonia', code: 'EE', flag: '🇪🇪' },
      { id: 'switzerland', name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
      { id: 'serbia', name: 'Serbia', code: 'RS', flag: '🇷🇸' },
      { id: 'bosnia', name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦' },
      { id: 'albania', name: 'Albania', code: 'AL', flag: '🇦🇱' },
      { id: 'north-macedonia', name: 'North Macedonia', code: 'MK', flag: '🇲🇰' },
      { id: 'montenegro', name: 'Montenegro', code: 'ME', flag: '🇲🇪' },
      { id: 'iceland', name: 'Iceland', code: 'IS', flag: '🇮🇸' },
      { id: 'luxembourg', name: 'Luxembourg', code: 'LU', flag: '🇱🇺' },
      { id: 'malta', name: 'Malta', code: 'MT', flag: '🇲🇹' },
      { id: 'cyprus', name: 'Cyprus', code: 'CY', flag: '🇨🇾' },
      { id: 'russia', name: 'Russia', code: 'RU', flag: '🇷🇺' },
      { id: 'ukraine', name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
      { id: 'belarus', name: 'Belarus', code: 'BY', flag: '🇧🇾' },
      { id: 'moldova', name: 'Moldova', code: 'MD', flag: '🇲🇩' }
    ],
    'middle-east': [
      { id: 'saudi-arabia', name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
      { id: 'uae', name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
      { id: 'qatar', name: 'Qatar', code: 'QA', flag: '🇶🇦' },
      { id: 'kuwait', name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
      { id: 'oman', name: 'Oman', code: 'OM', flag: '🇴🇲' },
      { id: 'bahrain', name: 'Bahrain', code: 'BH', flag: '🇧🇭' },
      { id: 'israel', name: 'Israel', code: 'IL', flag: '🇮🇱' },
      { id: 'jordan', name: 'Jordan', code: 'JO', flag: '🇯🇴' },
      { id: 'lebanon', name: 'Lebanon', code: 'LB', flag: '🇱🇧' },
      { id: 'syria', name: 'Syria', code: 'SY', flag: '🇸🇾' },
      { id: 'iraq', name: 'Iraq', code: 'IQ', flag: '🇮🇶' },
      { id: 'iran', name: 'Iran', code: 'IR', flag: '🇮🇷' },
      { id: 'turkey', name: 'Turkey', code: 'TR', flag: '🇹🇷' },
      { id: 'yemen', name: 'Yemen', code: 'YE', flag: '🇾🇪' },
      { id: 'palestine', name: 'Palestine', code: 'PS', flag: '🇵🇸' }
    ],
    'central-asia': [
      { id: 'kazakhstan', name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿' },
      { id: 'uzbekistan', name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿' },
      { id: 'turkmenistan', name: 'Turkmenistan', code: 'TM', flag: '🇹🇲' },
      { id: 'kyrgyzstan', name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬' },
      { id: 'tajikistan', name: 'Tajikistan', code: 'TJ', flag: '🇹🇯' },
      { id: 'azerbaijan', name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿' },
      { id: 'armenia', name: 'Armenia', code: 'AM', flag: '🇦🇲' },
      { id: 'georgia', name: 'Georgia', code: 'GE', flag: '🇬🇪' }
    ],
    'south-asia': [
      { id: 'india', name: 'India', code: 'IN', flag: '🇮🇳' },
      { id: 'pakistan', name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
      { id: 'bangladesh', name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
      { id: 'sri-lanka', name: 'Sri Lanka', code: 'LK', flag: '🇱🇰' },
      { id: 'nepal', name: 'Nepal', code: 'NP', flag: '🇳🇵' },
      { id: 'bhutan', name: 'Bhutan', code: 'BT', flag: '🇧🇹' },
      { id: 'maldives', name: 'Maldives', code: 'MV', flag: '🇲🇻' },
      { id: 'afghanistan', name: 'Afghanistan', code: 'AF', flag: '🇦🇫' }
    ],
    'east-asia': [
      { id: 'china', name: 'China', code: 'CN', flag: '🇨🇳' },
      { id: 'japan', name: 'Japan', code: 'JP', flag: '🇯🇵' },
      { id: 'south-korea', name: 'South Korea', code: 'KR', flag: '🇰🇷' },
      { id: 'north-korea', name: 'North Korea', code: 'KP', flag: '🇰🇵' },
      { id: 'mongolia', name: 'Mongolia', code: 'MN', flag: '🇲🇳' },
      { id: 'taiwan', name: 'Taiwan', code: 'TW', flag: '🇹🇼' }
    ],
    'southeast-asia': [
      { id: 'indonesia', name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
      { id: 'philippines', name: 'Philippines', code: 'PH', flag: '🇵🇭' },
      { id: 'vietnam', name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
      { id: 'thailand', name: 'Thailand', code: 'TH', flag: '🇹🇭' },
      { id: 'myanmar', name: 'Myanmar', code: 'MM', flag: '🇲🇲' },
      { id: 'malaysia', name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
      { id: 'singapore', name: 'Singapore', code: 'SG', flag: '🇸🇬' },
      { id: 'cambodia', name: 'Cambodia', code: 'KH', flag: '🇰🇭' },
      { id: 'laos', name: 'Laos', code: 'LA', flag: '🇱🇦' },
      { id: 'brunei', name: 'Brunei', code: 'BN', flag: '🇧🇳' },
      { id: 'timor-leste', name: 'Timor-Leste', code: 'TL', flag: '🇹🇱' }
    ],
    'africa': [
      { id: 'nigeria', name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
      { id: 'ethiopia', name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
      { id: 'egypt', name: 'Egypt', code: 'EG', flag: '🇪🇬' },
      { id: 'south-africa', name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
      { id: 'kenya', name: 'Kenya', code: 'KE', flag: '🇰🇪' },
      { id: 'tanzania', name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
      { id: 'ghana', name: 'Ghana', code: 'GH', flag: '🇬🇭' },
      { id: 'algeria', name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
      { id: 'morocco', name: 'Morocco', code: 'MA', flag: '🇲🇦' },
      { id: 'tunisia', name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
      { id: 'libya', name: 'Libya', code: 'LY', flag: '🇱🇾' },
      { id: 'sudan', name: 'Sudan', code: 'SD', flag: '🇸🇩' },
      { id: 'uganda', name: 'Uganda', code: 'UG', flag: '🇺🇬' },
      { id: 'zimbabwe', name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼' },
      { id: 'angola', name: 'Angola', code: 'AO', flag: '🇦🇴' },
      { id: 'mozambique', name: 'Mozambique', code: 'MZ', flag: '🇲🇿' },
      { id: 'cameroon', name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
      { id: 'ivory-coast', name: 'Ivory Coast', code: 'CI', flag: '🇨🇮' },
      { id: 'senegal', name: 'Senegal', code: 'SN', flag: '🇸🇳' },
      { id: 'rwanda', name: 'Rwanda', code: 'RW', flag: '🇷🇼' }
    ],
    'oceania': [
      { id: 'australia', name: 'Australia', code: 'AU', flag: '🇦🇺' },
      { id: 'new-zealand', name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
      { id: 'papua-new-guinea', name: 'Papua New Guinea', code: 'PG', flag: '🇵🇬' },
      { id: 'fiji', name: 'Fiji', code: 'FJ', flag: '🇫🇯' },
      { id: 'samoa', name: 'Samoa', code: 'WS', flag: '🇼🇸' },
      { id: 'vanuatu', name: 'Vanuatu', code: 'VU', flag: '🇻🇺' },
      { id: 'solomon-islands', name: 'Solomon Islands', code: 'SB', flag: '🇸🇧' },
      { id: 'tonga', name: 'Tonga', code: 'TO', flag: '🇹🇴' }
    ],
    'caribbean': [
      { id: 'cuba', name: 'Cuba', code: 'CU', flag: '🇨🇺' },
      { id: 'dominican-republic', name: 'Dominican Republic', code: 'DO', flag: '🇩🇴' },
      { id: 'haiti', name: 'Haiti', code: 'HT', flag: '🇭🇹' },
      { id: 'jamaica', name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
      { id: 'trinidad-tobago', name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹' },
      { id: 'bahamas', name: 'Bahamas', code: 'BS', flag: '🇧🇸' },
      { id: 'barbados', name: 'Barbados', code: 'BB', flag: '🇧🇧' }
    ]
  };

  // Get countries filtered by selected regions
  const filteredCountries = useMemo(() => {
    if (filters.regions.length === 0) {
      // Return all countries if no region selected
      return Object.values(allCountries).flat();
    }
    // Added type for region
    return filters.regions.flatMap((region: string) => allCountries[region] || []);
  }, [filters.regions]);

  const categories = [
    { id: 'politics', name: 'Politics & Strategy', icon: Shield, color: 'blue' },
    { id: 'economy', name: 'Economy & Finance', icon: DollarSign, color: 'green' },
    { id: 'technology', name: 'Technology & AI', icon: Zap, color: 'purple' },
    { id: 'energy', name: 'Energy & Commodities', icon: TrendingUp, color: 'orange' },
    { id: 'art', name: 'Art & Culture', icon: BookOpen, color: 'pink' },
    { id: 'military', name: 'Military & Defense', icon: Shield, color: 'red' },
    { id: 'social', name: 'Social & Trends', icon: Heart, color: 'rose' },
    { id: 'funding', name: 'Funding & Grants', icon: DollarSign, color: 'emerald' },
    { id: 'automotive', name: 'Automotive', icon: Car, color: 'slate' },
    { id: 'history', name: 'History & Heritage', icon: Clock, color: 'amber' },
    { id: 'environment', name: 'Environment', icon: Globe, color: 'teal' },
    { id: 'startups', name: 'Startups & Business', icon: TrendingUp, color: 'indigo' },
    { id: 'health', name: 'Health & Medicine', icon: Heart, color: 'red' },
    { id: 'science', name: 'Science & Research', icon: Sparkles, color: 'violet' },
    { id: 'sports', name: 'Sports', icon: TrendingUp, color: 'cyan' }
  ];

  const timeRanges = [
    { id: '24h', name: 'Last 24 Hours' },
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 3 Months' },
    { id: '6m', name: 'Last 6 Months' },
    { id: '1y', name: 'Last Year' },
    { id: '2y', name: 'Last 2 Years' },
    { id: '5y', name: 'Last 5 Years' },
    { id: '10y', name: 'Last 10 Years' },
    { id: 'custom', name: '📅 Custom Date Range' }
  ];

  const languages = [
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'az', name: 'Azerbaijani', flag: '🇦🇿' },
    { id: 'ru', name: 'Russian', flag: '🇷🇺' },
    { id: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { id: 'ko', name: 'Korean', flag: '🇰🇷' },
    { id: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { id: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'fr', name: 'French', flag: '🇫🇷' },
    { id: 'de', name: 'German', flag: '🇩🇪' },
    { id: 'pt', name: 'Portuguese', flag: '🇵🇹' }
    // Removed duplicate 'kr'
  ];

  // Added type for newsSources
  const newsSources: Record<string, string[]> = {
    azerbaijan: ['Azertac', 'Trend News Agency', 'Caspian News', 'Azeri Press Agency', 'Caucasian Review'],
    regional: ['Eurasianet', 'Caucasus Business Week', 'Baku Tribune', 'Emerging Europe'],
    global: ['BBC News', 'Reuters', 'Al Jazeera', 'The New York Times', 'The Guardian', 'Associated Press', 'National Geographic', 'CNN', 'France 24'],
    business: ['Financial Times', 'Bloomberg', 'Wall Street Journal', 'Forbes', 'The Economist', 'Business Insider'],
    energy: ['Oil Price', 'Energy Intelligence', 'S&P Global Platts'],
    tech: ['TechCrunch', 'The Information', 'MIT Tech Review', 'Wired', 'The Verge'],
    art: ['ARTnews', 'The Art Newspaper', 'Hyperallergic'],
    military: ["Jane's Defence Weekly", 'Military Times', 'The Diplomat'],
    social: ['Quartz', 'Vox', 'Fast Company', 'FiveThirtyEight', 'The Pudding'],
    philanthropy: ['Philanthropy News Digest', 'Devex', 'Stanford Social Innovation Review'],
    automotive: ['Automotive News', 'Electrek', 'Car & Driver'],
    history: ['History Today', 'Origins', 'National Geographic History'],
    thinkTanks: ['Brookings', 'CSIS', 'Chatham House'],
    environment: ['Carbon Brief', 'Nature']
  };

  // Mock news data with more realistic content
  const mockNews: NewsArticle[] = [ // Added type here
    {
      id: 1,
      title: 'Azerbaijan Signs Historic $15B Energy Deal with European Union',
      summary: 'Azerbaijan and the European Union have finalized a comprehensive energy partnership agreement worth $15 billion, aimed at diversifying energy supply routes and enhancing energy security for Europe.',
      category: 'energy',
      region: 'central-asia',
      countries: ['azerbaijan', 'eu'],
      impact: 'critical',
      source: 'Trend News Agency',
      date: '2025-10-25',
      aiInsight: 'This deal represents a strategic shift in European energy policy, reducing dependence on traditional suppliers by 23%. Expected to accelerate Azerbaijan\'s GDP growth by 4.2% annually.',
      rootCause: 'Geopolitical tensions and energy security concerns following recent global events have accelerated EU\'s diversification efforts. Azerbaijan\'s strategic location and proven reserves make it ideal partner.',
      confidence: 0.92,
      predictions: {
        '3m': { trend: 'up', value: 15, description: 'Trade volume increase expected' },
        '6m': { trend: 'up', value: 28, description: 'Infrastructure development acceleration' },
        '12m': { trend: 'stable', value: 35, description: 'Market stabilization phase' }
      },
      keyIndicators: ['Energy prices', 'Trade volume', 'Infrastructure investment', 'Political stability'],
      readTime: 8
    },
    {
      id: 2,
      title: 'Revolutionary AI System Achieves 98.5% Cancer Detection Accuracy',
      summary: 'Researchers at MIT and Stanford have developed an AI system that can detect 12 types of cancer from blood samples with unprecedented accuracy, potentially saving millions of lives.',
      category: 'technology',
      region: 'north-america',
      countries: ['usa'],
      impact: 'critical',
      source: 'MIT Tech Review',
      date: '2025-10-24',
      aiInsight: 'This represents a paradigm shift in medical diagnostics. System can detect cancer 18 months earlier than traditional methods, potentially reducing healthcare costs by $50B annually globally.',
      rootCause: 'Breakthrough convergence of advanced deep learning algorithms, availability of massive medical datasets, quantum computing acceleration, and unprecedented collaboration between tech and medical sectors.',
      confidence: 0.95,
      predictions: {
        '3m': { trend: 'up', value: 20, description: 'Clinical trials expansion to 50+ hospitals' },
        '6m': { trend: 'up', value: 45, description: 'FDA approval expected' },
        '12m': { trend: 'up', value: 70, description: 'Global adoption begins' }
      },
      keyIndicators: ['Accuracy rate', 'Clinical adoption', 'Cost reduction', 'Patient outcomes'],
      readTime: 12
    },
    {
      id: 3,
      title: 'Gold Surges to Record $2,450 Per Ounce Amid Economic Uncertainty',
      summary: 'Gold reaches historic high as investors flee to safe havens. Central banks accelerate purchases with China and India leading accumulation.',
      category: 'economy',
      region: 'global',
      countries: ['usa', 'china', 'india', 'switzerland'],
      impact: 'high',
      source: 'Bloomberg',
      date: '2025-10-26',
      aiInsight: 'Gold surge driven by trinity of factors: inflation concerns (40%), geopolitical tensions (35%), currency devaluation (25%). Historical analysis shows similar patterns preceded 1979 and 2011 peaks.',
      rootCause: 'Central banks accumulated record 800 tons in Q3 2025 - highest since 1967. US dollar weakness (DXY down 8%), persistent inflation above 3%, and ongoing conflicts create perfect storm for gold.',
      confidence: 0.88,
      predictions: {
        '3m': { trend: 'up', value: 10, description: 'Target: $2,700/oz on continued buying' },
        '6m': { trend: 'stable', value: 5, description: 'Consolidation $2,650-$2,750 range' },
        '12m': { trend: 'down', value: -8, description: 'Correction to $2,500 as markets stabilize' }
      },
      keyIndicators: ['Central bank buying', 'USD index', 'Inflation rates', 'Geopolitical risk index', 'Mining output'],
      readTime: 6
    },
    {
      id: 4,
      title: 'Baku Hosts Groundbreaking Renaissance Exhibition, Drawing Global Attention',
      summary: 'The Azerbaijan National Art Museum unveils unprecedented Renaissance collection featuring works from Uffizi, Louvre, and Prado. First week sees 50,000 visitors.',
      category: 'art',
      region: 'central-asia',
      countries: ['azerbaijan'],
      impact: 'medium',
      source: 'ARTnews',
      date: '2025-10-23',
      aiInsight: 'Cultural tourism to Azerbaijan expected to grow 45% YoY, generating estimated $280M additional revenue. Exhibition positioning Azerbaijan as emerging cultural hub of Eurasia.',
      rootCause: 'Strategic $500M investment in cultural infrastructure over past 5 years, coupled with international museum partnerships and government initiatives to diversify from oil-dependent economy.',
      confidence: 0.85,
      predictions: {
        '3m': { trend: 'up', value: 30, description: 'Tourism revenue spike' },
        '6m': { trend: 'up', value: 45, description: 'Cultural sector expansion' },
        '12m': { trend: 'stable', value: 50, description: 'Sustained growth trajectory' }
      },
      keyIndicators: ['Visitor numbers', 'Tourism revenue', 'International partnerships', 'Hotel occupancy'],
      readTime: 5
    },
    {
      id: 5,
      title: 'Electric Vehicles Overtake Combustion Engines in European Sales',
      summary: 'Historic milestone: EV sales surpass traditional vehicles across EU for first time. October 2025 marks 52% market share for electric vehicles.',
      category: 'automotive',
      region: 'europe',
      countries: ['germany', 'france', 'uk', 'norway', 'netherlands'],
      impact: 'critical',
      source: 'Automotive News',
      date: '2025-10-27',
      aiInsight: 'Inflection point accelerates global automotive transition. Data shows 67% of global markets will follow by 2027. Traditional automakers with <30% EV lineup face existential risk.',
      rootCause: 'Perfect storm: EU policy mandates, battery costs below $80/kWh threshold (Tesla at $56/kWh), charging infrastructure reaching critical 1:10 EV ratio, and consumer preference shift due to TCO advantages.',
      confidence: 0.93,
      predictions: {
        '3m': { trend: 'up', value: 15, description: 'Market share reaches 60%' },
        '6m': { trend: 'up', value: 32, description: 'Supply chain adaptation complete' },
        '12m': { trend: 'up', value: 55, description: 'Industry transformation finalized' }
      },
      keyIndicators: ['EV sales volume', 'Charging infrastructure', 'Battery costs', 'Policy incentives', 'Manufacturing capacity'],
      readTime: 7
    },
    {
      id: 6,
      title: 'International Coalition Launches $2B Climate Tech Fund for Emerging Markets',
      summary: 'Unprecedented climate technology initiative targets 50 countries across Africa, Asia, and Latin America. Program aims to fund 500+ startups over 5 years.',
      category: 'funding',
      region: 'global',
      countries: ['multiple'],
      impact: 'high',
      source: 'Devex',
      date: '2025-10-25',
      aiInsight: 'Represents 340% increase in climate tech funding for emerging markets. Program structure designed to catalyze $10B private sector investment through innovative blended finance mechanisms.',
      rootCause: 'Growing recognition that climate solutions must be globally distributed, not concentrated in developed economies. COP30 commitments and private sector ESG mandates creating unprecedented funding opportunity.',
      confidence: 0.90,
      predictions: {
        '3m': { trend: 'up', value: 25, description: '2,000+ applications expected' },
        '6m': { trend: 'up', value: 40, description: 'First cohort funding ($400M)' },
        '12m': { trend: 'up', value: 60, description: 'Ecosystem maturation, 200+ funded' }
      },
      keyIndicators: ['Applications received', 'Funding deployed', 'Startups launched', 'Jobs created', 'Carbon impact'],
      readTime: 9
    }
  ];

  // Chart data
  const goldPriceData = [
    { year: '2020', price: 1850, demand: 3200, production: 3500 },
    { year: '2021', price: 1800, demand: 3400, production: 3550 },
    { year: '2022', price: 1950, demand: 3600, production: 3450 },
    { year: '2023', price: 2100, demand: 3800, production: 3400 },
    { year: '2024', price: 2300, demand: 4100, production: 3350 },
    { year: '2025', price: 2450, demand: 4400, production: 3300 }
  ];

  const regionalEnergyData = [
    { region: 'Azerbaijan', production: 850, growth: 12, renewable: 15 },
    { region: 'EU', production: 1200, growth: -3, renewable: 42 },
    { region: 'Russia', production: 1800, growth: -8, renewable: 8 },
    { region: 'Middle East', production: 2400, growth: 5, renewable: 5 },
    { region: 'USA', production: 1900, growth: 7, renewable: 21 }
  ];

  const categoryDistribution = [
    { name: 'Energy', value: 24, color: '#f59e0b' },
    { name: 'Technology', value: 21, color: '#8b5cf6' },
    { name: 'Economy', value: 18, color: '#10b981' },
    { name: 'Politics', value: 15, color: '#3b82f6' },
    { name: 'Culture', value: 12, color: '#ec4899' },
    { name: 'Other', value: 10, color: '#6b7280' }
  ];

  useEffect(() => {
    // Simulate loading news
    setLoading(true);
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 800);
  }, [filters]);

  // Added type for filterType
  const toggleFilter = (filterType: ShowFilterKey) => {
    setShowFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
  };

  // Added types for filterKey and value
  const handleMultiSelect = (filterKey: FilterArrayKey, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterKey] as string[]; // Cast to string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      // If regions change, reset countries
      if (filterKey === 'regions') {
        return { ...prev, [filterKey]: newValues, countries: [] };
      }

      return { ...prev, [filterKey]: newValues };
    });
  };

  // Added types for filterKey and allValues
  const selectAllInFilter = (filterKey: FilterArrayKey, allValues: string[]) => {
    setFilters(prev => ({ ...prev, [filterKey]: allValues }));
  };

  // Added type for filterKey
  const clearFilter = (filterKey: FilterArrayKey | 'regions' | 'countries' | 'categories') => {
    // Widened type to accept strings from the clear buttons
    if (filterKey === 'regions' || filterKey === 'countries' || filterKey === 'categories' || filterKey === 'languages' || filterKey === 'sources') {
      setFilters(prev => ({ ...prev, [filterKey]: [] }));
    }
  };
  
  // Added type for value
  const handleTimeRangeChange = (value: string) => {
    if (value === 'custom') {
      setFilters(prev => ({ ...prev, timeRange: value, useCustomDate: true }));
    } else {
      setFilters(prev => ({ ...prev, timeRange: value, useCustomDate: false }));
    }
  };

  // Added type for articleId
  const saveArticle = (articleId: number) => {
    setSavedArticles(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  // Added type for articleId
  const markAsRead = (articleId: number) => {
    if (!readArticles.includes(articleId)) {
      setReadArticles(prev => [...prev, articleId]);
    }
  };

  // Added type for impact and the colors object
  const getImpactColor = (impact: string) => {
    const colors: Record<string, string> = {
      critical: 'from-red-500 to-red-600',
      high: 'from-orange-500 to-orange-600',
      medium: 'from-yellow-500 to-yellow-600',
      low: 'from-blue-500 to-blue-600'
    };
    return colors[impact] || colors.medium;
  };

  // Added type for trend
  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  // Added type for newsItem
  const handleSubscribe = (newsItem: NewsArticle) => {
    setSelectedNewsForSubscription(newsItem);
    setShowSubscribeModal(true);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    setTimeout(() => {
      const responses: Record<string, string> = {
        gold: "Gold prices show strong bullish momentum driven by central bank accumulation at historic highs (800 tons Q3). Technical analysis suggests resistance at $2,700, with support at $2,300. Key drivers: USD weakness, inflation persistence, geopolitical tensions. Recommendation: 60% probability of reaching $2,700 within 90 days.",
        energy: "Azerbaijan energy sector experiencing structural transformation with 12% YoY growth. EU partnership diversifies export markets, reducing Russia dependency by 23%. Infrastructure capex expected $4.5B over 24 months. Key risks: geopolitical tensions, commodity price volatility. Long-term outlook: positive with renewable energy transition positioning.",
        ai: "AI sector showing exponential growth trajectory - mentions up 211% since May. Medical diagnostics breakthrough validates commercial viability of narrow AI applications. Investment thesis: focus on healthcare AI, enterprise automation, and edge computing. Market cap expansion estimated $2.3T by 2027.",
        default: "I can provide deep analysis on specific topics. Try: 'Analyze gold market dynamics', 'What's driving Azerbaijan energy growth?', 'AI investment opportunities', or 'Global EV adoption trends'."
      };

      let response = responses.default;
      const input = chatInput.toLowerCase();

      if (input.includes('gold')) response = responses.gold;
      else if (input.includes('energy') || input.includes('azerbaijan')) response = responses.energy;
      else if (input.includes('ai') || input.includes('technology')) response = responses.ai;

      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Strategic News Intelligence</h1>
                <p className="text-sm text-blue-300">AI-Powered Global Analysis • Real-time Insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-400/30">
                <Bookmark className="w-4 h-4 text-purple-400" />
                <span className="text-white text-sm font-medium">{savedArticles.length} Saved</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-400/30">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">{subscriptions.length} Alerts</span>
              </div>
              <button
                onClick={() => setActiveView(activeView === 'news' ? 'analytics' : 'news')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2.5 rounded-lg text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2 shadow-lg"
              >
                <BarChart3 className="w-4 h-4" />
                {activeView === 'news' ? 'Analytics' : 'News Feed'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Advanced Filters Panel */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            {/* First Row: Time, Custom Topic, Search */}
            <div className="grid grid-cols-12 gap-3">
              {/* Time Range */}
              <div className="col-span-3">
                <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Range
                </label>
                <select
                  value={filters.timeRange}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTimeRangeChange(e.target.value)} // Added event type
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {timeRanges.map(range => (
                    <option key={range.id} value={range.id} className="bg-slate-800">
                      {range.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Date From */}
              {filters.useCustomDate && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-blue-300 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))} // Added event type
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}

              {/* Custom Date To */}
              {filters.useCustomDate && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-blue-300 mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))} // Added event type
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}

              {/* Custom Topic */}
              <div className={filters.useCustomDate ? "col-span-5" : "col-span-9"}>
                <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Topics, Keywords, Companies...
                </label>
                <input
                  type="text"
                  value={filters.customTopic}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, customTopic: e.target.value }))} // Added event type
                  placeholder="e.g., artificial intelligence, climate change, Tesla, oil prices..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Second Row: Multi-select Filters */}
            <div className="grid grid-cols-5 gap-3">
              {/* Regions Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Regions {filters.regions.length > 0 && `(${filters.regions.length})`}
                </label>
                <button
                  onClick={() => toggleFilter('regions')}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all text-sm"
                >
                  <span>{filters.regions.length > 0 ? `${filters.regions.length} selected` : 'All Regions'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters.regions ? 'rotate-180' : ''}`} />
                </button>

                {showFilters.regions && (
                  <div className="absolute top-full mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2 border-b border-white/10 flex gap-2">
                      <button
                        onClick={() => selectAllInFilter('regions', regions.map(r => r.id))}
                        className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-xs font-medium transition-all"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => clearFilter('regions')}
                        className="flex-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-xs font-medium transition-all"
                      >
                        Clear
                      </button>
                    </div>
                    {regions.map(region => (
                      <button
                        key={region.id}
                        onClick={() => handleMultiSelect('regions', region.id)}
                        className="w-full px-4 py-2.5 hover:bg-white/10 transition-all flex items-center gap-3 text-left border-b border-white/5"
                      >
                        {filters.regions.includes(region.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-2xl">{region.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium">{region.name}</div>
                          <div className="text-gray-400 text-xs">{region.countries} countries</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Countries Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Countries {filters.countries.length > 0 && `(${filters.countries.length})`}
                </label>
                <button
                  onClick={() => toggleFilter('countries')}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all text-sm"
                >
                  <span>{filters.countries.length > 0 ? `${filters.countries.length} selected` : 'All Countries'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters.countries ? 'rotate-180' : ''}`} />
                </button>

                {showFilters.countries && (
                  <div className="absolute top-full mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2 border-b border-white/10 sticky top-0 bg-slate-800">
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => selectAllInFilter('countries', filteredCountries.map(c => c.id))}
                          className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-xs font-medium transition-all"
                        >
                          Select All
                        </button>
                        <button
                          onClick={() => clearFilter('countries')}
                          className="flex-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-xs font-medium transition-all"
                        >
                          Clear
                        </button>
                      </div>
                      {filters.regions.length > 0 && (
                        <div className="text-xs text-gray-400 text-center">
                          Showing {filteredCountries.length} countries from selected regions
                        </div>
                      )}
                    </div>
                    {filteredCountries.length === 0 ? (
                      <div className="p-4 text-center text-gray-400 text-sm">
                        No countries in selected regions
                      </div>
                    ) : (
                      filteredCountries.map(country => (
                        <button
                          key={country.id}
                          onClick={() => handleMultiSelect('countries', country.id)}
                          className="w-full px-4 py-2.5 hover:bg-white/10 transition-all flex items-center gap-3 text-left border-b border-white/5"
                        >
                          {filters.countries.includes(country.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="text-xl">{country.flag}</span>
                          <span className="text-white text-sm">{country.name}</span>
                          <span className="text-gray-400 text-xs ml-auto">{country.code}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Categories Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Categories {filters.categories.length > 0 && `(${filters.categories.length})`}
                </label>
                <button
                  onClick={() => toggleFilter('categories')}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all text-sm"
                >
                  <span>{filters.categories.length > 0 ? `${filters.categories.length} selected` : 'All Categories'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters.categories ? 'rotate-180' : ''}`} />
                </button>

                {showFilters.categories && (
                  <div className="absolute top-full mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2 border-b border-white/10 flex gap-2">
                      <button
                        onClick={() => selectAllInFilter('categories', categories.map(c => c.id))}
                        className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-xs font-medium transition-all"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => clearFilter('categories')}
                        className="flex-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-xs font-medium transition-all"
                      >
                        Clear
                      </button>
                    </div>
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleMultiSelect('categories', category.id)}
                          className="w-full px-4 py-2.5 hover:bg-white/10 transition-all flex items-center gap-3 text-left border-b border-white/5"
                        >
                          {filters.categories.includes(category.id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                          <Icon className={`w-4 h-4 text-${category.color}-400 flex-shrink-0`} />
                          <span className="text-white text-sm">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Languages Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Languages {filters.languages.length > 0 && `(${filters.languages.length})`}
                </label>
                <button
                  onClick={() => toggleFilter('languages')}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all text-sm"
                >
                  <span>{filters.languages.length > 0 ? `${filters.languages.length} selected` : 'All Languages'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters.languages ? 'rotate-180' : ''}`} />
                </button>

                {showFilters.languages && (
                  <div className="absolute top-full mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2 border-b border-white/10 flex gap-2">
                      <button
                        onClick={() => selectAllInFilter('languages', languages.map(l => l.id))}
                        className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-xs font-medium transition-all"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => clearFilter('languages')}
                        className="flex-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-xs font-medium transition-all"
                      >
                        Clear
                      </button>
                    </div>
                    {languages.map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => handleMultiSelect('languages', lang.id)}
                        className="w-full px-4 py-2.5 hover:bg-white/10 transition-all flex items-center gap-3 text-left border-b border-white/5"
                      >
                        {filters.languages.includes(lang.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-white text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sources Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Sources {filters.sources.length > 0 && `(${filters.sources.length})`}
                </label>
                <button
                  onClick={() => toggleFilter('sources')}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-left flex items-center justify-between hover:bg-white/15 transition-all text-sm"
                >
                  <span>{filters.sources.length > 0 ? `${filters.sources.length} selected` : '50+ Sources'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters.sources ? 'rotate-180' : ''}`} />
                </button>

                {showFilters.sources && (
                  <div className="absolute top-full mt-2 w-full bg-slate-800 border border-white/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2 border-b border-white/10 flex gap-2">
                      <button
                        onClick={() => {
                          const allSources = Object.values(newsSources).flat();
                          selectAllInFilter('sources', allSources);
                        }}
                        className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-xs font-medium transition-all"
                      >
                        Select All
                      </button>
                      <button
                        onClick={() => clearFilter('sources')}
                        className="flex-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-xs font-medium transition-all"
                      >
                        Clear
                      </button>
                    </div>
                    {Object.entries(newsSources).map(([category, sources]) => (
                      <div key={category} className="border-b border-white/5">
                        <div className="px-4 py-2 bg-white/5">
                          <span className="text-blue-300 text-xs font-semibold uppercase">{category}</span>
                        </div>
                        {sources.map(source => (
                          <button
                            key={source}
                            onClick={() => handleMultiSelect('sources', source)}
                            className="w-full px-4 py-2 hover:bg-white/10 transition-all flex items-center gap-3 text-left pl-8"
                          >
                            {filters.sources.includes(source) ? (
                              <CheckSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="text-white text-sm">{source}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.regions.length > 0 || filters.countries.length > 0 || filters.categories.length > 0) && (
              <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-white/10">
                <span className="text-xs text-gray-400">Active filters:</span>
                {filters.regions.length > 0 && (
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs text-purple-300 flex items-center gap-2">
                    {filters.regions.length} region{filters.regions.length !== 1 ? 's' : ''}
                    <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => clearFilter('regions')} />
                  </span>
                )}
                {filters.countries.length > 0 && (
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-300 flex items-center gap-2">
                    {filters.countries.length} countr{filters.countries.length !== 1 ? 'ies' : 'y'}
                    <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => clearFilter('countries')} />
                  </span>
                )}
                {filters.categories.length > 0 && (
                  <span className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-300 flex items-center gap-2">
                    {filters.categories.length} categor{filters.categories.length !== 1 ? 'ies' : 'y'}
                    <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => clearFilter('categories')} />
                  </span>
                )}
                <button
                  onClick={() => setFilters({
                    timeRange: '7d',
                    regions: [],
                    countries: [],
                    categories: [],
                    languages: ['en'],
                    sources: [],
                    customTopic: '',
                    dateFrom: '',
                    dateTo: '',
                    useCustomDate: false
                  })}
                  className="ml-auto px-4 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-full text-xs text-red-300 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'news' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* News Feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  Intelligence Feed
                </h2>
                <div className="flex items-center gap-4 text-sm text-blue-300">
                  <span>{news.length} articles</span>
                  <span>•</span>
                  <span>{readArticles.length} read</span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white text-lg">Analyzing global intelligence...</p>
                  <p className="text-gray-400 text-sm mt-2">Processing from 50+ sources</p>
                </div>
              ) : (
                news.map(item => (
                  <div
                    key={item.id}
                    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all ${
                      readArticles.includes(item.id) ? 'opacity-75' : ''
                      }`}
                    onClick={() => markAsRead(item.id)}
                  >
                    {/* Header with Actions */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getImpactColor(item.impact)} text-white shadow-lg`}>
                            {item.impact.toUpperCase()}
                          </span>
                          <span className="text-sm text-blue-300 font-medium">{item.category}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-400">{item.date}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-400">{item.readTime} min read</span>
                          {readArticles.includes(item.id) && (
                            <>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="flex items-center gap-1 text-sm text-green-400">
                                <Eye className="w-3 h-3" />
                                Read
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight hover:text-blue-300 transition-colors cursor-pointer">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{item.summary}</p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); saveArticle(item.id); }} // Added event type
                          className={`p-2 rounded-lg ${
                            savedArticles.includes(item.id)
                              ? 'bg-purple-500/30 text-purple-300'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            } transition-all`}
                          title="Save article"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                          title="Share article"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Location Tags */}
                    {item.countries && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.countries.map((countryId, idx) => {
                          const country = Object.values(allCountries).flat().find(c => c.id === countryId);
                          return country ? (
                            <span key={idx} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300 flex items-center gap-1">
                              <span>{country.flag}</span>
                              <span>{country.name}</span>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}

                    {/* AI Insight */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-purple-300 font-semibold text-sm mb-1 flex items-center gap-2">
                            AI Deep Insight
                            <span className="px-2 py-0.5 bg-purple-500/20 rounded text-xs">{(item.confidence * 100).toFixed(0)}% confidence</span>
                          </h4>
                          <p className="text-purple-100 text-sm leading-relaxed">{item.aiInsight}</p>
                        </div>
                      </div>
                    </div>

                    {/* Root Cause Analysis */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-blue-300 font-semibold text-sm mb-1">Root Cause Analysis</h4>
                          <p className="text-blue-100 text-sm leading-relaxed">{item.rootCause}</p>
                        </div>
                      </div>
                    </div>

                    {/* Predictions */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {Object.entries(item.predictions).map(([period, pred]) => (
                        <div key={period} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">{period}</span>
                            {getTrendIcon(pred.trend)}
                          </div>
                          <div className={`text-2xl font-bold mb-1 ${
                            pred.trend === 'up' ? 'text-green-400' :
                              pred.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                            {pred.value > 0 ? '+' : ''}{pred.value}%
                          </div>
                          <p className="text-xs text-gray-300 leading-tight">{pred.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Key Indicators */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs text-gray-400 font-semibold">Key Indicators:</span>
                      {item.keyIndicators.map((indicator, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500/50 rounded-full text-xs text-gray-200 font-medium shadow-sm">
                          {indicator}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          <span className="font-medium text-blue-300">Source:</span> {item.source}
                        </span>
                      </div>
                      <button
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleSubscribe(item); }} // Added event type
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg"
                      >
                        <Bell className="w-4 h-4" />
                        Get Similar News
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Load More */}
              {!loading && news.length > 0 && (
                <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2">
                  Load More Articles
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* AI Chat Assistant */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-[200px]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Analysis Assistant</h3>
                    <p className="text-xs text-gray-400">Ask anything about the news</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">
                        I can analyze trends, predict movements, and explain events.
                      </p>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-blue-500/20 ml-8 border border-blue-400/30'
                          : 'bg-purple-500/20 mr-8 border border-purple-400/30'
                        }`}
                    >
                      <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)} // Added event type
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleChat()} // Added event type
                    placeholder="Ask AI anything..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <button
                    onClick={handleChat}
                    className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Questions */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-semibold mb-2">💡 Try asking:</p>
                  {[
                    'Analyze gold price trends',
                    'What\'s driving Azerbaijan energy?',
                    'EV market predictions',
                    'AI healthcare impact'
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setChatInput(q); handleChat(); }}
                      className="w-full text-left px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Analytics View */
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              Advanced Analytics & Market Intelligence
            </h2>

            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Articles', value: '1,247', change: '+12%', trend: 'up', icon: Globe, color: 'blue' },
                { label: 'AI Confidence', value: '91.5%', change: '+3%', trend: 'up', icon: Brain, color: 'purple' },
                { label: 'Critical Events', value: '23', change: '+8%', trend: 'up', icon: AlertCircle, color: 'red' },
                { label: 'Active Alerts', value: subscriptions.length, change: `+${subscriptions.length}`, trend: 'stable', icon: Bell, color: 'green' }
              ].map((metric: Metric, idx) => ( // Added Metric type
                <div key={idx} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`w-8 h-8 text-${metric.color}-400`} />
                    <span className={`text-${metric.trend === 'up' ? 'green' : 'gray'}-400 text-sm font-bold flex items-center gap-1`}>
                      {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gold Price Trends */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  Gold Price & Demand Analysis
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={goldPriceData}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="price" stroke="#f59e0b" fillOpacity={1} fill="url(#goldGradient)" name="Price ($/oz)" />
                    <Area type="monotone" dataKey="demand" stroke="#10b981" fillOpacity={0.6} fill="#10b981" name="Demand (tons)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Regional Energy Production */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  Regional Energy Production & Growth
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalEnergyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="region" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1x solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="production" fill="#f97316" name="Production (TWh)" />
                    <Bar dataKey="growth" fill="#10b981" name="Growth (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  News Topic Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      // Added types for label props
                      label={({ name, percent }: { name: string, percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Regional News Coverage */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Global News Coverage by Region
                </h3>
                <div className="space-y-3">
                  {regions.slice(0, 8).map((region, idx) => {
                    const coverage = Math.floor(Math.random() * 300) + 50;
                    const percentage = (coverage / 500) * 100;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-300">
                            <span className="text-xl">{region.emoji}</span>
                            {region.name}
                          </span>
                          <span className="text-white font-semibold">{coverage} articles</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Subscribe to Updates</h3>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="realtime" className="bg-slate-800">Real-time (as published)</option>
                  <option value="daily" className="bg-slate-800">Daily Digest (morning)</option>
                  <option value="weekly" className="bg-slate-800">Weekly Summary (Monday)</option>
                  <option value="biweekly" className="bg-slate-800">Bi-weekly</option>
                  <option value="monthly" className="bg-slate-800">Monthly Report</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSubscriptions(prev => [...prev, { id: Date.now(), topic: selectedNewsForSubscription?.title }]);
                  setShowSubscribeModal(false);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;