'use client';

import React from 'react';
import {
  TrendingUp, TrendingDown, Minus, Eye, Bookmark, Share2,
  ExternalLink, Bell, Calendar, Brain, AlertCircle, ShieldCheck,
} from 'lucide-react';
import { NewsArticle, Country } from './types';
import { getImpactColor, getCredibilityScore, getCredibilityMeta } from './helpers';

interface NewsCardProps {
  item: NewsArticle;
  readArticles: number[];
  savedArticles: number[];
  allCountries: Record<string, Country[]>;
  onOpen: (item: NewsArticle) => void;
  onSave: (id: number) => void;
  onSubscribe: (item: NewsArticle) => void;
}

const getTrendIcon = (trend: string) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
};

export default function NewsCard({
  item,
  readArticles,
  savedArticles,
  allCountries,
  onOpen,
  onSave,
  onSubscribe,
}: NewsCardProps) {
  const credibilityScore = getCredibilityScore(item.source);
  const credibilityMeta = credibilityScore !== null ? getCredibilityMeta(credibilityScore) : null;

  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all ${
        readArticles.includes(item.id) ? 'opacity-75' : ''
      }`}
      onClick={() => onOpen(item)}
    >
      {/* Header with Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
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
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSave(item.id); }}
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
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="text-gray-400">
            <span className="font-medium text-blue-300">Source:</span> {item.source}
          </span>

          {/* Source Credibility Score Badge */}
          {credibilityMeta && credibilityScore !== null && (
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${credibilityMeta.colorClass}`}
              title={`Credibility score: ${credibilityScore}/100`}
            >
              <ShieldCheck className="w-3 h-3" />
              {credibilityMeta.label} {credibilityScore}
            </span>
          )}

          <span className="text-gray-400 flex items-center gap-1 text-xs">
            <Calendar className="w-3 h-3" />
            {new Date(item.publishedDate || item.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })}
          </span>
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
            >
              <ExternalLink className="w-3 h-3" />
              View Original
            </a>
          )}
        </div>
        <button
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSubscribe(item); }}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg"
        >
          <Bell className="w-4 h-4" />
          Get Similar News
        </button>
      </div>
    </div>
  );
}
