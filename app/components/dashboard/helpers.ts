/**
 * Returns a Tailwind gradient class based on article impact level.
 * Used by NewsCard and ArticleModal.
 */
export const getImpactColor = (impact: string): string => {
  const colors: Record<string, string> = {
    critical: 'from-red-500 to-red-600',
    high: 'from-orange-500 to-orange-600',
    medium: 'from-yellow-500 to-yellow-600',
    low: 'from-blue-500 to-blue-600',
  };
  return colors[impact] || colors.medium;
};

/**
 * Source credibility scores (0–100) used in NewsCard to show a trust badge.
 * Based on established editorial standards, fact-checking track records,
 * and relevance to financial/academic audiences.
 *
 * Tier A (85–100): Major newswires + peer-reviewed/institutional sources
 * Tier B (70–84):  Established trade and broadcast outlets
 * Tier C (55–69):  Regional and specialist sources
 * Tier D (<55):    Unverified or aggregator sources
 */
export const SOURCE_CREDIBILITY: Record<string, number> = {
  // Tier A
  Reuters: 96,
  Bloomberg: 94,
  'Associated Press': 95,
  'Financial Times': 92,
  'The Guardian': 88,
  'MIT Tech Review': 91,
  'Nature': 98,
  'The Economist': 90,
  'Wall Street Journal': 89,
  'BBC News': 87,
  'BBC': 87,
  'The New York Times': 86,
  // Tier B
  'Al Jazeera': 80,
  CNN: 78,
  'France 24': 79,
  'Automotive News': 82,
  Devex: 76,
  Wired: 80,
  TechCrunch: 75,
  Forbes: 74,
  // Tier C
  'Trend News Agency': 68,
  Azertac: 65,
  'Caspian News': 62,
  ARTnews: 70,
  Eurasianet: 72,
  'Oil Price': 66,
  'Business Insider': 65,
  'Azeri Press Agency': 60,
  // Tier D — fallback
};

/** Returns score 0-100, or null if source is unknown */
export const getCredibilityScore = (source: string): number | null => {
  return SOURCE_CREDIBILITY[source] ?? null;
};

/** Returns label + color class for a given score */
export const getCredibilityMeta = (score: number): { label: string; colorClass: string } => {
  if (score >= 85) return { label: 'Verified', colorClass: 'bg-green-500/20 text-green-300 border-green-400/30' };
  if (score >= 70) return { label: 'Trusted', colorClass: 'bg-blue-500/20 text-blue-300 border-blue-400/30' };
  if (score >= 55) return { label: 'Regional', colorClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' };
  return { label: 'Unrated', colorClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
};
