'use client';

import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  BarChart3, TrendingUp, Brain, AlertCircle, Bell, Zap, MapPin, Globe,
} from 'lucide-react';
import { Metric } from './types';

interface Region {
  id: string;
  name: string;
  emoji: string;
  countries: number;
}

interface IntelligencePanelProps {
  goldPriceData: Array<{ year: string; price: number; demand: number; production: number }>;
  regionalEnergyData: Array<{ region: string; production: number; growth: number; renewable: number }>;
  categoryDistribution: Array<{ name: string; value: number; color: string }>;
  regions: Region[];
  subscriptions: any[];
}

export default function IntelligencePanel({
  goldPriceData,
  regionalEnergyData,
  categoryDistribution,
  regions,
  subscriptions,
}: IntelligencePanelProps) {
  const metrics: Metric[] = [
    { label: 'Total Articles', value: '1,247', change: '+12%', trend: 'up', icon: Globe, color: 'blue' },
    { label: 'AI Confidence', value: '91.5%', change: '+3%', trend: 'up', icon: Brain, color: 'purple' },
    { label: 'Critical Events', value: '23', change: '+8%', trend: 'up', icon: AlertCircle, color: 'red' },
    { label: 'Active Alerts', value: subscriptions.length, change: `+${subscriptions.length}`, trend: 'stable', icon: Bell, color: 'green' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-blue-400" />
        Advanced Analytics &amp; Market Intelligence
      </h2>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 text-${metric.color}-400`} />
                <span className={`text-${metric.trend === 'up' ? 'green' : 'gray'}-400 text-sm font-bold flex items-center gap-1`}>
                  {metric.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gold Price Trends */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Gold Price &amp; Demand Analysis
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
            Regional Energy Production &amp; Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalEnergyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="region" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
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
                label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
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
  );
}
