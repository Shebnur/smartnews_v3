'use client';

import React from 'react';
import {
  Clock, Search, Filter, MapPin, Globe, BookOpen, ChevronDown, ChevronUp,
  CheckSquare, Square, X, Copy, Check, FileCode, Sparkles, Bell,
} from 'lucide-react';
import { Filters, FilterArrayKey, ShowFilterKey, Country } from './types';

interface Region {
  id: string;
  name: string;
  emoji: string;
  countries: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

interface Language {
  id: string;
  name: string;
  flag: string;
}

interface TimeRange {
  id: string;
  name: string;
}

interface FiltersBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  showFilters: Record<ShowFilterKey, boolean>;
  searchTerms: Record<ShowFilterKey, string>;
  setSearchTerms: React.Dispatch<React.SetStateAction<Record<ShowFilterKey, string>>>;
  showFiltersPanel: boolean;
  setShowFiltersPanel: React.Dispatch<React.SetStateAction<boolean>>;
  queryCopied: boolean;
  filteredCountries: Country[];
  regions: Region[];
  categories: Category[];
  languages: Language[];
  timeRanges: TimeRange[];
  newsSources: Record<string, string[]>;
  toggleFilter: (key: ShowFilterKey) => void;
  handleMultiSelect: (key: FilterArrayKey, value: string) => void;
  selectAllInFilter: (key: FilterArrayKey, values: string[]) => void;
  clearFilter: (key: FilterArrayKey | 'regions' | 'countries' | 'categories') => void;
  handleTimeRangeChange: (value: string) => void;
  handleSearch: () => void;
  generateQueryString: () => string;
  copyFiltersToClipboard: () => void;
  setCustomQuery: React.Dispatch<React.SetStateAction<string>>;
  setInitialCustomQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowQueryModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FiltersBar({
  filters,
  setFilters,
  showFilters,
  searchTerms,
  setSearchTerms,
  showFiltersPanel,
  setShowFiltersPanel,
  queryCopied,
  filteredCountries,
  regions,
  categories,
  languages,
  timeRanges,
  newsSources,
  toggleFilter,
  handleMultiSelect,
  selectAllInFilter,
  clearFilter,
  handleTimeRangeChange,
  handleSearch,
  generateQueryString,
  copyFiltersToClipboard,
  setCustomQuery,
  setInitialCustomQuery,
  setShowQueryModal,
}: FiltersBarProps) {
  const defaultFilters: Filters = {
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
    useCustomDate: false,
  };

  return (
    <>
      {/* Show Filters Button — only visible when panel is hidden */}
      {!showFiltersPanel && (
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-[73px] z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 relative">
            <button
              onClick={() => setShowFiltersPanel(true)}
              className="absolute top-2 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              title="Show Filters"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFiltersPanel && (
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-[73px] z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 relative">
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="absolute top-2 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
              title={showFiltersPanel ? 'Hide Filters' : 'Show Filters'}
            >
              {showFiltersPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFiltersPanel && (
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
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTimeRangeChange(e.target.value)}
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  )}

                  {/* Custom Topic */}
                  <div className={filters.useCustomDate ? 'col-span-5' : 'col-span-9'}>
                    <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Search Topics, Keywords, Companies...
                    </label>
                    <input
                      type="text"
                      value={filters.customTopic}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, customTopic: e.target.value }))}
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
                        <div className="p-2 border-b border-white/10 space-y-2 sticky top-0 bg-slate-800 z-10">
                          <input
                            type="text"
                            value={searchTerms.regions}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, regions: e.target.value }))}
                            placeholder="Search regions..."
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
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
                        </div>
                        {regions
                          .filter(region => region.name.toLowerCase().includes(searchTerms.regions.toLowerCase()))
                          .map(region => (
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
                        <div className="p-2 border-b border-white/10 sticky top-0 bg-slate-800 space-y-2">
                          <input
                            type="text"
                            value={searchTerms.countries}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, countries: e.target.value }))}
                            placeholder="Search countries..."
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
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
                          filteredCountries
                            .filter(country => country.name.toLowerCase().includes(searchTerms.countries.toLowerCase()))
                            .map(country => (
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
                        <div className="p-2 border-b border-white/10 space-y-2 sticky top-0 bg-slate-800">
                          <input
                            type="text"
                            value={searchTerms.categories}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, categories: e.target.value }))}
                            placeholder="Search categories..."
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
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
                        </div>
                        {categories
                          .filter(category => category.name.toLowerCase().includes(searchTerms.categories.toLowerCase()))
                          .map(category => {
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
                        <div className="p-2 border-b border-white/10 space-y-2 sticky top-0 bg-slate-800">
                          <input
                            type="text"
                            value={searchTerms.languages}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, languages: e.target.value }))}
                            placeholder="Search languages..."
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
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
                        </div>
                        {languages
                          .filter(lang => lang.name.toLowerCase().includes(searchTerms.languages.toLowerCase()))
                          .map(lang => (
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
                        <div className="p-2 border-b border-white/10 space-y-2 sticky top-0 bg-slate-800">
                          <input
                            type="text"
                            value={searchTerms.sources}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, sources: e.target.value }))}
                            placeholder="Search sources..."
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => selectAllInFilter('sources', Object.values(newsSources).flat())}
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
                        </div>
                        {Object.entries(newsSources).map(([category, sources]) => (
                          <div key={category} className="border-b border-white/5">
                            <div className="px-4 py-2 bg-white/5">
                              <span className="text-blue-300 text-xs font-semibold uppercase">{category}</span>
                            </div>
                            {sources
                              .filter(source => source.toLowerCase().includes(searchTerms.sources.toLowerCase()))
                              .map(source => (
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

                {/* Custom Category Input */}
                {filters.categories.includes('custom') && (
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-3">
                      <Sparkles className="w-4 h-4" />
                      Custom Category
                    </label>
                    <input
                      type="text"
                      value={filters.customCategory}
                      onChange={(e) => setFilters({ ...filters, customCategory: e.target.value })}
                      placeholder="e.g., banking, football, renewable energy..."
                      className="w-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all text-base shadow-lg backdrop-blur-sm"
                    />
                  </div>
                )}

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
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={copyFiltersToClipboard}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                        title="Copy filter query"
                      >
                        {queryCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          const q = generateQueryString();
                          setCustomQuery(q);
                          setInitialCustomQuery(q);
                          setShowQueryModal(true);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                        title="Advanced query editor"
                      >
                        <FileCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setFilters(defaultFilters)}
                        className="px-4 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-full text-xs text-red-300 transition-all"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}

                {/* Advanced Query button when no filters active */}
                {!(filters.regions.length > 0 || filters.countries.length > 0 || filters.categories.length > 0) && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        setCustomQuery(generateQueryString());
                        setShowQueryModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/10"
                      title="Write custom query"
                    >
                      <Search className="w-4 h-4" />
                      <span className="text-sm">Advanced Query</span>
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={handleSearch}
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all shadow-lg"
                  >
                    <Search className="w-5 h-5" />
                    Search Intelligence
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-xl text-emerald-300 font-semibold transition-all">
                    <Bell className="w-5 h-5" />
                    Subscribe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
