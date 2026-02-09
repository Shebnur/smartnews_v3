"use client";

// Added FC (Functional Component) to the import
import React, { useState, useEffect, useMemo, FC } from 'react';
import { Search, Filter, TrendingUp, Globe, BookOpen, DollarSign, Zap, Shield, Heart, Car, Clock, Bell, MessageSquare, ChevronDown,ChevronUp, X, Check, ArrowRight, BarChart3, Brain, Mail, Calendar, AlertCircle, TrendingDown, Minus, MapPin, CheckSquare, Square, Bookmark, Share2, ExternalLink, Eye, Sparkles, Copy, Building2,FileCode,HelpCircle } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector';
import AuthNav from './components/AuthNav';
import FiltersBar from './components/dashboard/FiltersBar';
import NewsCard from './components/dashboard/NewsCard';
import ArticleModal from './components/dashboard/ArticleModal';
import IntelligencePanel from './components/dashboard/IntelligencePanel';
import { NewsArticle, ChatMessage, Filters, FilterArrayKey, ShowFilterKey, Metric, Country } from './components/dashboard/types';

// Types are imported from ./components/dashboard/types

// --- COMPONENT START ---
const App: FC = () => {
  const [filters, setFilters] = useState<Filters>({
    timeRange: '7d',
    regions: [],
    countries: [],
    categories: [],
    languages: ['en'],
    sources: [],
    customTopic: '',
    customCategory: '',
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
  const [subscribeMethod, setSubscribeMethod] = useState<'website' | 'email' | 'telegram'>('website');
  const [subscribeFrequency, setSubscribeFrequency] = useState<'realtime' | 'hourly' | 'daily' | 'weekly'>('daily');
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeTelegram, setSubscribeTelegram] = useState('');
  const [selectedNewsForSubscription, setSelectedNewsForSubscription] = useState<NewsArticle | null>(null);
  const [showFullNewsModal, setShowFullNewsModal] = useState(false);
  const [selectedFullNews, setSelectedFullNews] = useState<NewsArticle | null>(null);
  const [loadingFullArticle, setLoadingFullArticle] = useState(false);
  const [articleContent, setArticleContent] = useState<{content: string; html: string; author?: string} | null>(null);
  const [savedArticles, setSavedArticles] = useState<number[]>([]);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [initialCustomQuery, setInitialCustomQuery] = useState('');
  const [queryCopied, setQueryCopied] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);
  const [queryValidationError, setQueryValidationError] = useState<string | null>(null);
  const [querySuggestion, setQuerySuggestion] = useState<string | null>(null);
  const [showQueryHelp, setShowQueryHelp] = useState(false);
  const [queryAutocomplete, setQueryAutocomplete] = useState<Array<{text: string; type: string; description: string}>>([]);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [queryErrors, setQueryErrors] = useState<Array<{start: number; end: number; message: string}>>([]);
  const [searchTerms, setSearchTerms] = useState({
    regions: '',
    countries: '',
    categories: '',
    languages: '',
    sources: ''
  });
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
      /*Return all countries if no region selected*/
      return Object.values(allCountries).flat();
    }
    return filters.regions.flatMap((region: string) => allCountries[region] || []);
  }, [filters.regions]);

  const categories = [
    { id: 'custom', name: 'Custom Category', icon: Sparkles, color: 'purple' },
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
  const mockNews: NewsArticle[] = [ 
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
      readTime: 8,
      language: 'en',
      publishedDate: '2025-10-25T10:30:00Z',
      sourceUrl: 'https://trend.az/azerbaijan/business/3865432.html'
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
      readTime: 12,
      language: 'en',
      publishedDate: '2025-10-24T08:00:00Z',
      sourceUrl: 'https://www.technologyreview.com/2025/10/24/ai-cancer-detection/'
    
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
      readTime: 6,
      language: 'en',
      publishedDate: '2025-10-26T09:30:00Z',
      sourceUrl: 'https://www.bloomberg.com/news/articles/gold-surge-record-high'
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
      readTime: 5,
      language: 'en',
      publishedDate: '2025-10-23T14:00:00Z',
      sourceUrl: 'https://www.artnews.com/azerbaijan-museum-opening/'
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
      readTime: 7,
      language: 'en',
      publishedDate: '2025-10-27T10:15:00Z',
      sourceUrl: 'https://www.automotivenews.com/ev-overtake-europe/'
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
      readTime: 9,
      language: 'en',
      publishedDate: '2025-10-25T11:00:00Z',
      sourceUrl: 'https://www.devex.com/news/climate-tech-fund-emerging-markets'
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
    // Fetch real news when component mounts or filters change
    fetchRealNews();
  }, [filters.countries, filters.categories, filters.languages]);


  const toggleFilter = (filterType: ShowFilterKey) => {
    setShowFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
  };

  // Added types for filterKey and value
  const handleMultiSelect = (filterKey: FilterArrayKey, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterKey] as string[];
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
    /* Widened type to accept strings from the clear buttons*/
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
// Fetch real news from scrapers
  const fetchRealNews = async () => {
    setLoading(true);
    try {
      // Build query with filters
      const params = new URLSearchParams();
      
      if (filters.countries.length > 0) {
        params.append('country', filters.countries[0]);
      }
      
      if (filters.categories.length > 0) {
        params.append('category', filters.categories[0]);
      }
      
      // Determine which sources to scrape based on filters
      const sources: string[] = [];
      if (filters.countries.includes('azerbaijan') || filters.countries.includes('az')) {
        sources.push('azertac', 'trend');
      }
      if (filters.categories.includes('economy')) {
        sources.push('bloomberg', 'reuters');
      }
      if (sources.length === 0) {
        // Default: scrape all
        sources.push('azertac', 'trend', 'bbc', 'reuters');
      }
      
      params.append('sources', sources.join(','));
      
      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.articles);
      } else {
        console.error('Failed to fetch news:', data.error);
        setNews(mockNews); // Fallback
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews(mockNews); // Fallback
    } finally {
      setLoading(false);
    }
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
  // Fetch full article content from URL
const fetchFullArticle = async (url: string) => {
  setLoadingFullArticle(true);
  setArticleContent(null);
  
  try {
    // Use our own extraction API
    const response = await fetch(`/api/extract-article?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (data.success && data.content) {
      // Successfully extracted content
      setArticleContent({
        content: data.content,
        html: data.html || `<p>${data.content}</p>`,
        author: data.author
      });
    } else {
      // Couldn't extract, show preview from summary
      const currentArticle = news.find(n => n.sourceUrl === url);
      setArticleContent({
        content: currentArticle?.summary || 'Content not available',
        html: `
          <div class="space-y-6">
            <div class="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
              <p class="text-yellow-300 text-sm">
                ℹ️ Full article extraction is not available for this source.
              </p>
            </div>
            
            <div class="prose prose-invert">
              <h3 class="text-lg font-semibold text-white mb-3">Article Preview</h3>
              <p class="text-gray-300">${currentArticle?.summary || 'No preview available'}</p>
            </div>
            
            <div class="text-center pt-4">
              <a 
                href="${url}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all shadow-lg"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Read Full Article on ${currentArticle?.source || 'Original Site'}
              </a>
            </div>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error('Error fetching article:', error);
    // On error, show preview + link
    const currentArticle = news.find(n => n.sourceUrl === url);
    setArticleContent({
      content: currentArticle?.summary || 'Unable to load content',
      html: `
        <div class="space-y-6">
          <div class="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
            <p class="text-red-300 text-sm">
              ⚠️ Unable to load full article content. Network error or source protection.
            </p>
          </div>
          
          ${currentArticle?.summary ? `
            <div class="prose prose-invert">
              <h3 class="text-lg font-semibold text-white mb-3">Article Preview</h3>
              <p class="text-gray-300">${currentArticle.summary}</p>
            </div>
          ` : ''}
          
          <div class="text-center pt-4">
            <a 
              href="${url}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Original Source
            </a>
          </div>
        </div>
      `,
    });
  } finally {
    setLoadingFullArticle(false);
  }
};
const generateQueryString = () => {
  const queries = [];
  
  // ALWAYS add time/date first
  if (filters.useCustomDate) {
    if (filters.dateFrom) queries.push(`dateFrom = '${filters.dateFrom}'`);
    if (filters.dateTo) queries.push(`dateTo = '${filters.dateTo}'`);
  } else {
    // Always include timeRange
    queries.push(`timeRange = '${filters.timeRange}'`);
  }
  
  // ALWAYS add keywords if present
  if (filters.customTopic?.trim()) {
    queries.push(`keywords contains "${filters.customTopic.trim()}"`);
  }
  
  // Countries
  if (filters.countries.length > 0) {
    const countryNames = filters.countries.map(id => {
      const country = Object.values(allCountries).flat().find(c => c.id === id);
      return country?.name || id;
    });
    queries.push(`country in ('${countryNames.join("', '")}')`);
  }
  
  // Regions
  if (filters.regions.length > 0) {
    const regionNames = filters.regions.map(id => {
      const region = regions.find(r => r.id === id);
      return region?.name || id;
    });
    queries.push(`region in ('${regionNames.join("', '")}')`);
  }
  
  // Categories
  if (filters.categories.length > 0) {
    const categoryNames = filters.categories.map(id => {
      const category = categories.find(c => c.id === id);
      return category?.name || id;
    });
    queries.push(`category in ('${categoryNames.join("', '")}')`);
  }
  
  // Languages
  if (filters.languages.length > 0 && !(filters.languages.length === 1 && filters.languages[0] === 'en')) {
  queries.push(`language in ('${filters.languages.join("', '")}')`);
}
  
  // Sources
  if (filters.sources.length > 0) {
    queries.push(`source in ('${filters.sources.join("', '")}')`);
  }
  
  return queries.join(' AND ');
};

const validateQuery = (query: string): { valid: boolean; error?: string; suggestion?: { wrong: string; correct: string } } => {
  if (!query.trim()) {
    return { valid: false, error: 'Query cannot be empty' };
  }
  
  const validFields = ['timeRange', 'dateFrom', 'dateTo', 'country', 'region', 'category', 'language', 'source', 'keywords'];
  const validLanguages = ['en', 'az', 'ru', 'tr', 'es', 'fr', 'de', 'ar', 'zh', 'ja'];
  const validTimeRanges = ['24h', '7d', '30d', '90d', '1y'];
  
  // Split by AND
  const parts = query.split(' AND ').map(p => p.trim());
  
  for (const part of parts) {
    // Check for 'field in (...)'
    const inMatch = part.match(/^(\w+)\s+in\s+\(([^)]+)\)$/);
    if (inMatch) {
      const field = inMatch[1];
      const valuesString = inMatch[2];
      
      if (!validFields.includes(field)) {
  // Check for typos
  const typoSuggestions: { [key: string]: string } = {
    'lang': 'language',
    'langs': 'language',
    'cat': 'category',
    'cats': 'category',
    'ctry': 'country',
    'countries': 'country',
    'reg': 'region',
    'time': 'timeRange',
    'date': 'dateFrom or dateTo',
    'key': 'keywords',
    'keyword': 'keywords'
  };
  
  const suggestion = typoSuggestions[field.toLowerCase()];
  if (suggestion) {
    return { 
      valid: false, 
      error: `'${field}' → Did you mean '${suggestion}'?`,
      suggestion: { wrong: field, correct: suggestion }
    };
  }
  
  return { valid: false, error: `Invalid field: '${field}'. Valid fields: ${validFields.join(', ')}` };
}
      
      
      // Check if values are properly quoted - be flexible with spacing
  const hasQuotes = valuesString.includes("'");
  if (!hasQuotes) {
    return { 
  valid: false, 
  error: `❌ Syntax Error in '${field} in (...)':\n\n⚠️ Problem: Values must be quoted\n\n✅ Correct format: ${field} in ('value1', 'value2')\n\n💡 Tip: Put quotes around each value` 
};
}
      
      // Special validation for languages
      // Special validation for languages
if (field === 'language') {
  const langs = valuesString.match(/'([^']+)'/g)?.map(l => l.replace(/'/g, ''));
  const invalidLangs = langs?.filter(l => !validLanguages.includes(l));
  
  if (invalidLangs && invalidLangs.length > 0) {
    // Check for typos/partial matches
    const languageMap: { [key: string]: string } = {
      'azer': 'az',
      'azerbaijan': 'az',
      'azeri': 'az',
      'english': 'en',
      'russian': 'ru',
      'russia': 'ru',
      'turkish': 'tr',
      'turkey': 'tr',
      'spanish': 'es',
      'french': 'fr',
      'france': 'fr',
      'german': 'de',
      'germany': 'de',
      'arabic': 'ar',
      'chinese': 'zh',
      'china': 'zh',
      'japanese': 'ja',
      'japan': 'ja',
      'korean': 'ko',
      'korea': 'ko'
    };
    
    const suggestions = invalidLangs.map(invalid => {
      const suggestion = languageMap[invalid.toLowerCase()] || 
                        validLanguages.find(v => v.startsWith(invalid.toLowerCase()));
      return suggestion ? `'${invalid}' → Did you mean '${suggestion}'?` : `'${invalid}' (invalid)`;
    });
    
    return { 
      valid: false, 
      error: `❌ Invalid Language Code(s):\n\n${suggestions.join('\n')}\n\n💡 Use 2-letter codes: en, az, ru, tr, fr, es, de, ar, zh, ja, ko`,
      suggestion: { 
        wrong: invalidLangs[0], 
        correct: languageMap[invalidLangs[0]?.toLowerCase()] 
        }
     };
  }
}
      if (field === 'category') {
        const cats = valuesString.match(/'([^']+)'/g)?.map(c => c.replace(/'/g, ''));
        const validCategories = ['Economy & Finance', 'Technology & AI', 'Energy & Commodities', 
          'Art & Culture', 'Social & Trends', 'Funding & Grants', 'Automotive', 'History & Heritage', 
          'Startups & Business', 'Health & Medicine', 'Science & Research', 'Sports', 
          'Military & Defense', 'Environment', 'Politics & Strategy', 'Custom Category'];
        
        const invalidCats = cats?.filter(c => !validCategories.includes(c) && c !== 'art');
        if (invalidCats && invalidCats.length > 0) {
          const suggestions = invalidCats.map(invalid => {
            // Find close match
            const suggestion = validCategories.find(valid => 
              valid.toLowerCase().includes(invalid.toLowerCase())
            );
            return suggestion ? `'${invalid}' → Did you mean '${suggestion}'?` : `'${invalid}'`;
          });
          
          return { 
            valid: false, 
            error: `Invalid category:\n${suggestions.join('\n')}\n\nUse 'Custom Category' for custom searches.` 
          };
        }
        
        // Special case: 'art' → suggest 'Art & Culture'
        if (cats?.includes('art')) {
          return {
            valid: false,
            error: `'art' → Did you mean 'Art & Culture'?`
          };
        }
      }
      // Special validation for categories
      if (field === 'category') {
        const cats = valuesString.match(/'([^']+)'/g)?.map(c => c.replace(/'/g, ''));
        const validCategories = categories.map(c => c.name);
        const invalidCats = cats?.filter(c => !validCategories.includes(c));
        
        if (invalidCats && invalidCats.length > 0) {
          // Try to find suggestions
          const suggestions = invalidCats.map(invalid => {
            const suggestion = validCategories.find(valid => 
              valid.toLowerCase().includes(invalid.toLowerCase()) || 
              invalid.toLowerCase().includes(valid.toLowerCase())
            );
            return suggestion ? `'${invalid}' → Did you mean '${suggestion}'?` : `'${invalid}' (not found)`;
          });
          
          return { 
            valid: false, 
            error: `Invalid category:\n${suggestions.join('\n')}\n\nValid categories: ${validCategories.join(', ')}` 
          };
        }
      }
      continue;
    }
    
    // Check for 'field contains "..."'
    const containsMatch = part.match(/^(\w+)\s+contains\s+"([^"]+)"$/);
    if (containsMatch) {
      const field = containsMatch[1];
      if (!validFields.includes(field)) {
        return { valid: false, error: `Invalid field: '${field}'. Valid fields: ${validFields.join(', ')}` };
      }
      if (field !== 'keywords') {
        return { valid: false, error: `Only 'keywords' field supports 'contains' operator. Use: keywords contains "text"` };
      }
      continue;
    }
    
    // Check for 'field = value'
    const equalsMatch = part.match(/^(\w+)\s+=\s+'([^']+)'$/);
    if (equalsMatch) {
      const field = equalsMatch[1];
      const value = equalsMatch[2];
      
      if (!validFields.includes(field)) {
        // Check for common typos
        if (field === 'date') {
          return { valid: false, error: `Invalid field: 'date'. Did you mean 'dateFrom' or 'dateTo'?` };
        }
        return { valid: false, error: `Invalid field: '${field}'. Valid fields: ${validFields.join(', ')}` };
      }
      
      // Validate timeRange values
      if (field === 'timeRange') {
  if (!value.match(/^\d+(h|d|m|y)$/)) {
    return { valid: false, error: `Invalid timeRange format: '${value}'. Use format: number + h/d/m/y (e.g., '20d', '42h', '160d', '6m')` };
  }
}
      
      // Validate date format
      if ((field === 'dateFrom' || field === 'dateTo') && !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return { valid: false, error: `Invalid date format for '${field}'. Use: ${field} = 'YYYY-MM-DD'` };
      }
      
      continue;
    }
    
    // SMART DETECTION: Check if query is incomplete (not invalid)
    
    // 1. Incomplete 'language in' without values
    if (part.match(/^language\s+in\s*$/)) {
      return { 
        valid: false, 
        error: `⏸️ Incomplete Query:\n\n'language in' needs values in parentheses.\n\n✅ Complete it like:\nlanguage in ('az', 'en', 'ru')\n\n💡 Available languages: en, az, ru, tr, fr, es, de, ar, zh, ja, ko` 
      };
    }
    
    // 2. Incomplete 'field in' without values
    if (part.match(/^(\w+)\s+in\s*$/)) {
      const field = part.match(/^(\w+)/)?.[1];
      const examples = {
        'country': "country in ('Azerbaijan', 'USA', 'UK')",
        'category': "category in ('Technology & AI', 'Economy & Finance')",
        'region': "region in ('Europe', 'Asia')",
        'source': "source in ('BBC', 'CNN')"
      };
      const example = examples[field as keyof typeof examples] || `${field} in ('value1', 'value2')`;
      
      return { 
        valid: false, 
        error: `⏸️ Incomplete Query:\n\n'${field} in' needs values in parentheses.\n\n✅ Complete it like:\n${example}` 
      };
    }
    
    // 3. Incomplete 'keywords contains' without text
    if (part.match(/^keywords\s+contains\s*$/)) {
      return { 
        valid: false, 
        error: `⏸️ Incomplete Query:\n\n'keywords contains' needs text in quotes.\n\n✅ Complete it like:\nkeywords contains "AI technology"\n\n💡 Tip: Use double quotes for the search text` 
      };
    }
    
    // 4. Incomplete 'field =' without value
    if (part.match(/^(\w+)\s+=\s*$/)) {
      const field = part.match(/^(\w+)/)?.[1];
      const examples = {
        'timeRange': "timeRange = '7d'",
        'dateFrom': "dateFrom = '2025-01-01'",
        'dateTo': "dateTo = '2025-12-31'"
      };
      const example = examples[field as keyof typeof examples] || `${field} = 'value'`;
      
      return { 
        valid: false, 
        error: `⏸️ Incomplete Query:\n\n'${field} =' needs a value in quotes.\n\n✅ Complete it like:\n${example}` 
      };
    }
    
    // 5. Generic incomplete detection (ends with operator)
    if (part.match(/(in|contains|=)\s*$/)) {
      return { 
        valid: false, 
        error: `⏸️ Incomplete Query:\n\nYour query ends with an operator but needs a value.\n\n💡 Examples:\n• language in ('az', 'en')\n• keywords contains "text"\n• timeRange = '7d'` 
      };
    }
    
    // If truly invalid (not incomplete), show the original error
    return { valid: false, error: `❌ Invalid Syntax:\n\n'${part}'\n\n💡 Check syntax examples below for correct format.` };
  }
  
  return { valid: true };
};
const getCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
  const div = document.createElement('div');
  const style = getComputedStyle(element);
  
  [...style].forEach(prop => {
    div.style.setProperty(prop, style.getPropertyValue(prop));
  });
  
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  
  div.textContent = element.value.substring(0, position);
  
  const span = document.createElement('span');
  span.textContent = element.value.substring(position) || '.';
  div.appendChild(span);
  
  document.body.appendChild(div);
  
  const coordinates = {
    top: span.offsetTop,
    left: span.offsetLeft
  };
  
  document.body.removeChild(div);
  
  return coordinates;
};
const getQuerySuggestion = (query: string): string | null => {
  if (!query.trim()) return null;
  
  const lastPart = query.split(' AND ').pop()?.trim() || '';
  
  // Field name suggestions
  const fieldTypos: { [key: string]: string } = {
    'lang': 'language',
    'langs': 'language',
    'cat': 'category',
    'cats': 'category',
    'ctry': 'country',
    'reg': 'region',
    'time': 'timeRange',
    'key': 'keywords'
  };
  
  for (const [typo, correct] of Object.entries(fieldTypos)) {
    if (lastPart.startsWith(typo + ' ')) {
      return `💡 Tab: '${typo}' → '${correct}'`;
    }
  }
  
  // Language code suggestions
  const langMatch = lastPart.match(/language in \('([^']*)/);
  if (langMatch) {
    const partial = langMatch[1].toLowerCase();
    const langMap: { [key: string]: string } = {
      'azer': 'az',
      'azerbaijan': 'az',
      'eng': 'en',
      'english': 'en',
      'rus': 'ru',
      'russian': 'ru',
      'tur': 'tr',
      'turkish': 'tr'
    };
    
    const suggestion = langMap[partial] || 
                      ['en', 'az', 'ru', 'tr', 'es', 'fr', 'de', 'ar', 'zh', 'ja'].find(l => l.startsWith(partial));
    
    if (suggestion) {
      return `💡 Tab: '${suggestion}' (${partial.length > 0 ? partial : 'language code'})`;
    }
  }
  
  // Category suggestions
  if (lastPart === "category in ('art')") {
    return "💡 Tab: 'art' → 'Art & Culture'";
  }
  
  const catMatch = lastPart.match(/category in \('([^']*)/);
  if (catMatch) {
    const partial = catMatch[1].toLowerCase();
    const validCategories = ['Art & Culture', 'Economy & Finance', 'Technology & AI', 'Energy & Commodities', 
      'Social & Trends', 'Funding & Grants', 'Automotive', 'History & Heritage', 
      'Startups & Business', 'Health & Medicine', 'Science & Research', 'Sports', 
      'Military & Defense', 'Environment', 'Politics & Strategy'];
    
    const match = validCategories.find(c => c.toLowerCase().startsWith(partial) || c.toLowerCase().includes(partial));
    if (match) return `💡 Tab: '${match}'`;
  }
  return null;
};
const getAutocomplete = (query: string, cursorPos: number): Array<{text: string; type: string; description: string}> => {
  const beforeCursor = query.substring(0, cursorPos);
  const lastWord = beforeCursor.split(/[\s(),'"]/).pop()?.toLowerCase() || '';
  
  if (!lastWord) return [];
  
  const suggestions: Array<{text: string; type: string; description: string}> = [];
  
  // Field suggestions
  const fields = [
    { name: 'timeRange', desc: 'Time period (e.g., 7d, 30d, 24h)' },
    { name: 'dateFrom', desc: 'Start date (YYYY-MM-DD)' },
    { name: 'dateTo', desc: 'End date (YYYY-MM-DD)' },
    { name: 'country', desc: 'Country names' },
    { name: 'region', desc: 'Geographic regions' },
    { name: 'category', desc: 'News categories' },
    { name: 'language', desc: 'Language codes (en, az, ru, etc.)' },
    { name: 'source', desc: 'News sources' },
    { name: 'keywords', desc: 'Search terms' }
  ];
  
  fields.forEach(field => {
    if (field.name.toLowerCase().startsWith(lastWord)) {
      suggestions.push({ text: field.name, type: 'field', description: field.desc });
    }
  });
  
  // Language code suggestions
  if (beforeCursor.includes('language in (')) {
    const langs = [
      { code: 'en', name: 'English' },
      { code: 'az', name: 'Azerbaijani' },
      { code: 'ru', name: 'Russian' },
      { code: 'tr', name: 'Turkish' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'ar', name: 'Arabic' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' }
    ];
    
    langs.forEach(lang => {
      if (lang.code.startsWith(lastWord) || lang.name.toLowerCase().startsWith(lastWord)) {
        suggestions.push({ text: `'${lang.code}'`, type: 'value', description: lang.name });
      }
    });
  }
  
  // Category suggestions
  if (beforeCursor.includes('category in (')) {
    const cats = ['Economy & Finance', 'Technology & AI', 'Art & Culture', 'Sports', 'Politics & Strategy'];
    cats.forEach(cat => {
      if (cat.toLowerCase().includes(lastWord)) {
        suggestions.push({ text: `'${cat}'`, type: 'value', description: 'Category' });
      }
    });
  }
  
  // Operator suggestions
  if (lastWord.length > 0 && !beforeCursor.endsWith('(')) {
    const operators = [
      { text: 'AND', desc: 'Combine conditions' },
      { text: 'in', desc: 'Match any value in list' },
      { text: 'contains', desc: 'Text search' }
    ];
    operators.forEach(op => {
      if (op.text.toLowerCase().startsWith(lastWord)) {
        suggestions.push({ text: op.text, type: 'operator', description: op.desc });
      }
    });
  }
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
};

const highlightQueryErrors = (query: string) => {
  // Simplified - only show obvious syntax errors, not semantic validation
  const errors: Array<{start: number; end: number; message: string}> = [];
  
  // Only check for completely missing quotes
  if (query.includes('in (') && !query.match(/in \('[^']*'\)/)) {
    errors.push({ start: 0, end: 0, message: 'Values in () must be quoted' });
  }
  
  setQueryErrors(errors);
};

  const applyQueryString = (query: string) => {
  // Validate first
  const validation = validateQuery(query);
  if (!validation.valid) {
    alert(`❌ Query Error:\n\n${validation.error}`);
    return;
  }
  
  try {
    const newFilters = { ...filters };


      const dateFromMatch = query.match(/dateFrom = '([^']+)'/);
    if (dateFromMatch) {
      newFilters.dateFrom = dateFromMatch[1];
      newFilters.useCustomDate = true;
    }

      const dateToMatch = query.match(/dateTo = '([^']+)'/);
    if (dateToMatch) {
      newFilters.dateTo = dateToMatch[1];
      newFilters.useCustomDate = true;
    }

      const timeRangeMatch = query.match(/timeRange = '([^']+)'/);
    if (timeRangeMatch) {
      newFilters.timeRange = timeRangeMatch[1];
      newFilters.useCustomDate = false;
    }

      const countryMatch = query.match(/country in \('([^']+(?:', '[^']+)*)'\)/);
      if (countryMatch) {
        const countryNames = countryMatch[1].split("', '");
        newFilters.countries = Object.values(allCountries).flat()
          .filter(c => countryNames.includes(c.name))
          .map(c => c.id);
      }
      
      const regionMatch = query.match(/region in \('([^']+(?:', '[^']+)*)'\)/);
      if (regionMatch) {
        const regionNames = regionMatch[1].split("', '");
        newFilters.regions = regions
          .filter(r => regionNames.includes(r.name))
          .map(r => r.id);
      }
      
      const categoryMatch = query.match(/category in \('([^']+(?:', '[^']+)*)'\)/);
      if (categoryMatch) {
        const categoryNames = categoryMatch[1].split("', '");
        newFilters.categories = categories
          .filter(c => categoryNames.includes(c.name))
          .map(c => c.id);
      }

      const languageMatch = query.match(/language in \('([^']+(?:', '[^']+)*)'\)/);
    if (languageMatch) {
      newFilters.languages = languageMatch[1].split("', '");
    }
    
      const sourceMatch = query.match(/source in \('([^']+(?:', '[^']+)*)'\)/);
    if (sourceMatch) {
      newFilters.sources = sourceMatch[1].split("', '");
    }
      
      const keywordsMatch = query.match(/keywords contains "([^"]+)"/);
      if (keywordsMatch) {
        newFilters.customTopic = keywordsMatch[1];
      }
      
      setFilters(newFilters);
      setShowQueryModal(false);
      // Trigger search immediately
      setTimeout(() => {
        setLoading(true);
        setTimeout(() => {
         setNews(getFilteredNews());
          setLoading(false);
       }, 500);
    }, 100);
    alert('✅ Query applied successfully!\n\nFilters updated and search executed.');
    } catch (error) {
      alert('Invalid query format. Please check your syntax.');
    }
  };

  const copyFiltersToClipboard = () => {
    const query = generateQueryString();
    navigator.clipboard.writeText(query);
    setQueryCopied(true);
    setTimeout(() => setQueryCopied(false), 2000);
  };
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredResults = getFilteredNews();
      setNews(filteredResults);
      setLoading(false);
    }, 800);
  };

  // Filter news based on selected filters
  const getFilteredNews = () => {
    let filtered = [...mockNews];

    // Filter by regions
    if (filters.regions.length > 0) {
      filtered = filtered.filter(article => 
        filters.regions.includes(article.region)
      );
    }

    // Filter by countries
    if (filters.countries.length > 0) {
      filtered = filtered.filter(article => 
        article.countries.some(country => filters.countries.includes(country))
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(article => 
        filters.categories.includes(article.category)
      );
    }

    // Filter by custom topic/keywords
    if (filters.customTopic.trim()) {
      const keyword = filters.customTopic.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(keyword) ||
        article.summary.toLowerCase().includes(keyword) ||
        article.aiInsight.toLowerCase().includes(keyword)
      );
    }

    /* Filter by sources*/
    if (filters.sources.length > 0) {
      filtered = filtered.filter(article => 
        filters.sources.includes(article.source)
      );
    }
    // Filter by languages
    if (filters.languages.length > 0) {
      filtered = filtered.filter(article => 
        article.language && filters.languages.includes(article.language)
      );
    }

    // Filter by date range
    if (filters.useCustomDate) {
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filtered = filtered.filter(article => 
          new Date(article.date) >= fromDate
    );
  }
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    filtered = filtered.filter(article => 
      new Date(article.date) <= toDate
    );
  }
}

    return filtered;
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


              <LanguageSelector />
              <AuthNav />
            </div>
          </div>
        </div>
      </header>


      {/* Filters Bar */}
      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        searchTerms={searchTerms}
        setSearchTerms={setSearchTerms}
        showFiltersPanel={showFiltersPanel}
        setShowFiltersPanel={setShowFiltersPanel}
        queryCopied={queryCopied}
        filteredCountries={filteredCountries}
        regions={regions}
        categories={categories}
        languages={languages}
        timeRanges={timeRanges}
        newsSources={newsSources}
        toggleFilter={toggleFilter}
        handleMultiSelect={handleMultiSelect}
        selectAllInFilter={selectAllInFilter}
        clearFilter={clearFilter}
        handleTimeRangeChange={handleTimeRangeChange}
        handleSearch={handleSearch}
        generateQueryString={generateQueryString}
        copyFiltersToClipboard={copyFiltersToClipboard}
        setCustomQuery={setCustomQuery}
        setInitialCustomQuery={setInitialCustomQuery}
        setShowQueryModal={setShowQueryModal}
      />

    

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

              {!loading && news.length === 0 && (
                <div className="text-center py-20">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-white text-lg">No articles match your filters</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              )}

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white text-lg">Analyzing global intelligence...</p>
                  <p className="text-gray-400 text-sm mt-2">Processing from 50+ sources</p>
                </div>
              ) : (
                news.map(item => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    readArticles={readArticles}
                    savedArticles={savedArticles}
                    allCountries={allCountries}
                    onOpen={(article) => {
                      markAsRead(article.id);
                      setSelectedFullNews(article);
                      setShowFullNewsModal(true);
                      if (article.sourceUrl) fetchFullArticle(article.sourceUrl);
                    }}
                    onSave={saveArticle}
                    onSubscribe={handleSubscribe}
                  />
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleChat()} 
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
          <IntelligencePanel
            goldPriceData={goldPriceData}
            regionalEnergyData={regionalEnergyData}
            categoryDistribution={categoryDistribution}
            regions={regions}
            subscriptions={subscriptions}
          />
        )}
      </div>

      {/* Query Editor Modal */}
      {showQueryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Advanced Filter Query</h3>
              <button
                  onClick={() => {
                  // Check if user made changes
                    const hasChanges = customQuery.trim() !== initialCustomQuery.trim();
    
                    if (hasChanges) {
                      const confirmed = confirm('⚠️ Close Advanced Query?\n\nYour current query will be lost.\n\nClick OK to close, or Cancel to continue editing.');
                         if (confirmed) {
                            setCustomQuery('');
                            setQueryValidationError(null);
                            setQueryErrors([]);
                            setShowQueryModal(false);
                    }
                    } else {
                      setShowQueryModal(false);
                    }
              }}
              className="text-gray-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Filter Query
                </label>
                <div className="relative">
  <div className="space-y-2">
  <div className="flex items-center justify-between">
    <label className="text-sm text-gray-400">Filter Query (Jira-like syntax)</label>
    <div className="flex items-center gap-2">
      {/* Clickable error icon */}
      {queryValidationError && (
        <button
          onClick={() => alert(`❌ Validation Error:\n\n${queryValidationError}`)}
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
          title="Click to see error details"
        >
          💡
        </button>
      )}
      {/* Clickable warning icon for real-time errors */}
      {queryErrors.length > 0 && (
        <button
          onClick={() => alert(`⚠️ Syntax Issues:\n\n• ${queryErrors.map(e => e.message).join('\n• ')}`)}
          className="text-red-400 hover:text-red-300 transition-colors"
          title="Click to see syntax issues"
        >
          ⚠️
        </button>
      )}
      <button
        onClick={() => setShowQueryHelp(!showQueryHelp)}
        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
      >
        <HelpCircle className="w-3 h-3" />
        {showQueryHelp ? 'Hide' : 'Show'} Field Reference
      </button>
    </div>
  </div>
</div>
  
  {showQueryHelp && (
    <div className="mb-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg text-xs space-y-2">
      <div className="font-semibold text-blue-300">Available Fields:</div>
      <div className="grid grid-cols-2 gap-2 text-gray-300">
        <div><code className="text-blue-400">timeRange</code> = '7d' | '30d' | '90d'</div>
        <div><code className="text-blue-400">dateFrom</code> = '2025-01-01'</div>
        <div><code className="text-blue-400">country</code> in ('Azerbaijan')</div>
        <div><code className="text-blue-400">region</code> in ('Europe', 'Asia')</div>
        <div><code className="text-blue-400">category</code> in ('Technology & AI')</div>
        <div><code className="text-blue-400">language</code> in ('en', 'az', 'ru')</div>
        <div><code className="text-blue-400">source</code> in ('BBC', 'CNN')</div>
        <div><code className="text-blue-400">keywords</code> contains "AI"</div>
      </div>
      <div className="text-gray-400 mt-2">💡 Start typing to see autocomplete suggestions</div>
    </div>
  )}
  <textarea
    value={customQuery}
    onChange={(e) => {
      const newValue = e.target.value;
      setCustomQuery(newValue);
      highlightQueryErrors(newValue);
  
  // Update autocomplete
      const cursorPos = e.target.selectionStart;
      const suggestions = getAutocomplete(newValue, cursorPos);
      setQueryAutocomplete(suggestions);
}}

    onKeyDown={(e) => {
      if (e.key === 'Tab' && queryAutocomplete.length > 0) {
        e.preventDefault();
        const firstSuggestion = queryAutocomplete[0];
        const textarea = e.target as HTMLTextAreaElement;
        const cursorPos = textarea.selectionStart;
        const beforeCursor = customQuery.substring(0, cursorPos);
        const afterCursor = customQuery.substring(cursorPos);
        const lastWordStart = beforeCursor.lastIndexOf(' ') + 1;
        
        const newQuery = beforeCursor.substring(0, lastWordStart) + firstSuggestion.text + ' ' + afterCursor;
        setCustomQuery(newQuery);
        setQueryAutocomplete([]);
      }
    }}
    placeholder="Example: timeRange = '30d' AND country in ('Azerbaijan') AND keywords contains &quot;AI&quot;"
    rows={6}
    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
    spellCheck={false}
  />
  
  {/* Autocomplete Dropdown */}
  {queryAutocomplete.length > 0 && (
  <div 
    className="absolute z-50 bg-slate-800 border border-white/20 rounded-lg shadow-2xl max-w-sm"
    style={{ top: `${autocompletePosition.top + 20}px`, left: `${autocompletePosition.left}px` }}
  >
      {queryAutocomplete.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => {
            const textarea = document.querySelector('textarea');
            if (textarea) {
              const cursorPos = textarea.selectionStart;
              const beforeCursor = customQuery.substring(0, cursorPos);
              const afterCursor = customQuery.substring(cursorPos);
              const lastWordStart = beforeCursor.lastIndexOf(' ') + 1;
              
              const newQuery = beforeCursor.substring(0, lastWordStart) + suggestion.text + ' ' + afterCursor;
              setCustomQuery(newQuery);
              setQueryAutocomplete([]);
            }
          }}
          className="w-full px-3 py-2 hover:bg-white/10 text-left flex items-center gap-3 border-b border-white/5 last:border-0"
        >
          <span className={`px-2 py-0.5 rounded text-xs font-mono ${
            suggestion.type === 'field' ? 'bg-blue-500/20 text-blue-300' :
            suggestion.type === 'value' ? 'bg-green-500/20 text-green-300' :
            'bg-purple-500/20 text-purple-300'
          }`}>
            {suggestion.type}
          </span>
          <div className="flex-1">
            <div className="text-white font-mono text-sm">{suggestion.text}</div>
           <div className="text-gray-400 text-xs">{suggestion.description}</div>
          </div>
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">Tab</kbd>
        </button>
      ))}
    </div>
  )}
  
  
</div>
                <p className="text-xs text-gray-400 mt-2">
                  Syntax: <code className="bg-white/10 px-2 py-0.5 rounded">field in ('value1', 'value2')</code> or <code className="bg-white/10 px-2 py-0.5 rounded">field contains "text"</code> or <code className="bg-white/10 px-2 py-0.5 rounded">dateFrom = 'YYYY-MM-DD'</code>
                </p>
              </div>

              <div className="space-y-3">
               <div className="flex gap-3">
                
  <button
    onClick={() => {
      navigator.clipboard.writeText(customQuery);
      setQueryCopied(true);
      setTimeout(() => setQueryCopied(false), 2000);
    }}
    className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white font-medium transition-all flex items-center gap-2"
  >
    {queryCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    {queryCopied ? 'Copied!' : 'Copy Query'}
  </button>
  
  <button
  onClick={() => {
  const validation = validateQuery(customQuery);
  if (validation.valid) {
    setQueryValidationError(null);
    alert('✅ Query is valid!\n\nYou can now click "Apply Query" to use these filters.');
  } else {
    setQueryValidationError(validation.error || null);
    const hasSuggestion = validation.error?.includes('→');
    alert(`❌ Query Validation Failed\n\n${validation.error}${hasSuggestion ? '\n\n💡 A "Fix Query" button will appear below to auto-correct this.' : ''}`);
  }
}}
  className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg text-yellow-300 font-medium transition-all flex items-center gap-2"
>
  <FileCode className="w-4 h-4" />
  Test Query
</button>
  
  <button
    onClick={() => applyQueryString(customQuery)}
    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
  >
    Apply Query
  </button>
</div>

{/* Fix Button Row - Shows when there's an error */}
{queryValidationError && (
  <div className="flex gap-3">
    <button
      onClick={() => {
        let fixed = customQuery;
        
        // Fix field name typos
        const fieldTypos: { [key: string]: string } = {
          'lang': 'language',
          'langs': 'language',
          'cat': 'category',
          'cats': 'category',
          'ctry': 'country',
          'reg': 'region',
          'time': 'timeRange',
          'key': 'keywords'
        };
        
        for (const [wrong, correct] of Object.entries(fieldTypos)) {
          if (queryValidationError.includes(`'${wrong}' → Did you mean '${correct}'`)) {
            fixed = fixed.replace(new RegExp(`\\b${wrong}\\b`, 'g'), correct);
          }
        }
        
        // Fix language codes
        const langMap: { [key: string]: string } = {
  'azer': 'az',
  'azerbaijan': 'az',
  'azeri': 'az',
  'english': 'en',
  'russian': 'ru',
  'russia': 'ru',
  'turkish': 'tr',
  'turkey': 'tr',
  'french': 'fr',
  'france': 'fr',
  'spanish': 'es',
  'spain': 'es',
  'german': 'de',
  'germany': 'de',
  'korean': 'ko',
  'korea': 'ko'
};

const changes: string[] = []; // Track what was changed
        
        for (const [wrong, correct] of Object.entries(langMap)) {
  if (queryValidationError.includes(`'${wrong}' → Did you mean '${correct}'`)) {
    fixed = fixed.replace(new RegExp(`'${wrong}'`, 'gi'), `'${correct}'`);
    changes.push(`'${wrong}' → '${correct}'`);
  }
}
        
        // Fix 'art' → 'Art & Culture'
        if (queryValidationError.includes("'art' → Did you mean 'Art & Culture'")) {
          fixed = fixed.replace(/(['"])art\1/gi, "'Art & Culture'");
        }
        
        // General catch-all
        const generalMatch = queryValidationError.match(/'([^']+)' → Did you mean '([^']+)'\?/);
        if (generalMatch) {
          const [, wrong, correct] = generalMatch;
          if (!fixed.includes(correct)) {
            fixed = fixed.replace(new RegExp(`'${wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'), `'${correct}'`);
          }
        }
        
        // Check if anything was actually fixed
        if (fixed !== customQuery && changes.length > 0) {
          setCustomQuery(fixed);
          setQueryValidationError(null);
          const beforeAfter = changes.map((c, i) => `${i + 1}. ${c}`).join('\n');
          alert(`✅ Query Fixed Successfully!\n\n📝 Changes Made:\n${beforeAfter}\n\n✔️ Next Step: Click "Test Query" to verify`);
      } else {
   // Show what couldn't be fixed
        const helpText = queryValidationError.includes('must be quoted') 
          ? '💡 Add quotes around values: in (\'value1\', \'value2\')'
          : queryValidationError.includes('Invalid field')
          ? '💡 Check field names. Valid: timeRange, language, country, category, region, source, keywords'
          : '💡 Check syntax carefully';
  
      alert(`⚠️ Could not auto-fix this error.\n\nError:\n${queryValidationError}\n\n${helpText}\n\nPlease fix manually.`);
}
      }}
      className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-lg py-3 text-green-300 font-medium transition-all flex items-center justify-center gap-2"
    >
      <Check className="w-4 h-4" />
      🔧 Fix Query Automatically
    </button>
  </div>
)}
</div>
            </div>
          </div>
        </div>
      )}

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
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                <select 
                  value={subscribeFrequency}
                  onChange={(e) => setSubscribeFrequency(e.target.value as any)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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

      {/* Article Modal */}
      <ArticleModal
        showFullNewsModal={showFullNewsModal}
        selectedFullNews={selectedFullNews}
        loadingFullArticle={loadingFullArticle}
        articleContent={articleContent}
        onClose={() => setShowFullNewsModal(false)}
      />

    </div>
   
    
  );
};

export default App;