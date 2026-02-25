'use client';

import React from 'react';
import {
  X, Building2, Calendar, ExternalLink, Sparkles,
  AlertCircle, TrendingUp, TrendingDown, ArrowRight,
} from 'lucide-react';
import { NewsArticle } from './types';

interface ArticleModalProps {
  showFullNewsModal: boolean;
  selectedFullNews: NewsArticle | null;
  loadingFullArticle: boolean;
  articleContent: { content: string; html: string; author?: string } | null;
  onClose: () => void;
}

export default function ArticleModal({
  showFullNewsModal,
  selectedFullNews,
  loadingFullArticle,
  articleContent,
  onClose,
}: ArticleModalProps) {
  if (!showFullNewsModal || !selectedFullNews) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl flex items-center justify-between p-6 border-b border-white/10 z-10">
          <h2 className="text-2xl font-bold text-white">{selectedFullNews.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {selectedFullNews.source}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(selectedFullNews.publishedDate || selectedFullNews.date).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              selectedFullNews.impact === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              selectedFullNews.impact === 'high' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              selectedFullNews.impact === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-blue-500 to-blue-600'
            } text-white`}>
              {selectedFullNews.impact.toUpperCase()} IMPACT
            </span>
            {selectedFullNews.sourceUrl && (
              <a
                href={selectedFullNews.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 ml-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Read Original Source
              </a>
            )}
          </div>

          {/* Full Article Content */}
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-white mb-3">Full Story</h3>

            {loadingFullArticle ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-3 text-gray-400">Loading full article...</span>
              </div>
            ) : articleContent ? (
              <>
                {articleContent.author && (
                  <p className="text-sm text-gray-400 mb-4">By {articleContent.author}</p>
                )}
                <div
                  className="text-gray-300 text-base leading-relaxed article-content"
                  dangerouslySetInnerHTML={{ __html: articleContent.html }}
                />
              </>
            ) : (
              <p className="text-gray-300 text-base leading-relaxed">{selectedFullNews.summary}</p>
            )}
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI Strategic Analysis</h3>
              <span className="ml-auto px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-300 font-medium">
                {Math.round(selectedFullNews.confidence * 100)}% Confidence
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">{selectedFullNews.aiInsight}</p>
          </div>

          {/* Root Cause */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Root Cause Analysis</h3>
            </div>
            <p className="text-blue-100 leading-relaxed">{selectedFullNews.rootCause}</p>
          </div>

          {/* Predictions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Future Predictions</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(selectedFullNews.predictions).map(([period, pred]) => (
                <div key={period} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 uppercase font-bold">{period}</span>
                    {pred.trend === 'up' ? <TrendingUp className="w-5 h-5 text-green-400" /> :
                     pred.trend === 'down' ? <TrendingDown className="w-5 h-5 text-red-400" /> :
                     <ArrowRight className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${
                    pred.trend === 'up' ? 'text-green-400' :
                    pred.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {pred.value > 0 ? '+' : ''}{pred.value}%
                  </div>
                  <p className="text-sm text-gray-300">{pred.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Indicators */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Key Indicators to Monitor</h3>
            <div className="flex flex-wrap gap-2">
              {selectedFullNews.keyIndicators.map((indicator, idx) => (
                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-500/50 rounded-lg text-sm text-gray-200 font-medium">
                  {indicator}
                </span>
              ))}
            </div>
          </div>

          {/* Source Information */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Source Information</h3>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{selectedFullNews.source}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Published: {new Date(selectedFullNews.publishedDate || selectedFullNews.date).toLocaleString()}
                  </p>
                </div>
                {selectedFullNews.sourceUrl && (
                  <a
                    href={selectedFullNews.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium flex items-center gap-2 transition-all"
                  >
                    Read Full Article <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
