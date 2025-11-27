'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  MessageSquare,
  FileSearch,
  Activity as ActivityIcon,
  Filter,
  Bookmark,
  Bell,
  User,
  LogOut,
  Clock,
  FileText,
  TrendingUp,
  Newspaper,
  BarChart3,
  Settings as SettingsIcon,
  Search,
  Brain,
  Sparkles,
  ArrowUpRight,
  Eye,
  Mail,
  Lock,
  Camera,
  AlertCircle,
  CheckCircle,
  History,
  Zap,
  Target
} from 'lucide-react'

type TabType = 'dashboard' | 'analytics' | 'chats' | 'search' | 'saved' | 'filters' | 'subscriptions' | 'alerts' | 'settings'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      loadProfileData()
    }
  }, [status, router])

  const loadProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-white text-lg">Loading your profile...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Newspaper, description: 'AI-powered news feed' },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3, description: 'Advanced predictions' },
    { id: 'alerts' as TabType, label: 'Smart Alerts', icon: Zap, description: 'Interest notifications' },
    { id: 'chats' as TabType, label: 'AI Chats', icon: MessageSquare, description: 'Chat history' },
    { id: 'search' as TabType, label: 'Search History', icon: History, description: 'Past searches' },
    { id: 'saved' as TabType, label: 'Saved News', icon: Bookmark, description: 'Bookmarked articles' },
    { id: 'filters' as TabType, label: 'Filters', icon: Filter, description: 'Saved filters' },
    { id: 'subscriptions' as TabType, label: 'Subscriptions', icon: Bell, description: 'Topics & sources' },
    { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon, description: 'Account settings' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                {session.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{session.user?.name || 'User Profile'}</h1>
                <p className="text-blue-400 mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {session.user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Back to News
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{tab.label}</div>
                    {activeTab !== tab.id && (
                      <div className="text-xs text-slate-500 mt-0.5">{tab.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              {activeTab === 'dashboard' && <DashboardTab profileData={profileData} />}
              {activeTab === 'analytics' && <AnalyticsTab profileData={profileData} />}
              {activeTab === 'alerts' && <SmartAlertsTab />}
              {activeTab === 'chats' && <ChatArchivesTab />}
              {activeTab === 'search' && <SearchHistoryTab />}
              {activeTab === 'saved' && <SavedNewsTab />}
              {activeTab === 'filters' && <SavedFiltersTab />}
              {activeTab === 'subscriptions' && <SubscriptionsTab />}
              {activeTab === 'settings' && <SettingsTab session={session} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Tab - AI-Powered News Feed
function DashboardTab({ profileData }: { profileData: any }) {
  const aiNews = [
    {
      id: 1,
      title: 'AI Breakthrough in Quantum Computing Could Revolutionize Drug Discovery',
      summary: 'Researchers announce major advancement in quantum algorithms for molecular simulation...',
      category: 'Technology',
      source: 'Nature Science',
      relevance: 95,
      timeAgo: '2 hours ago',
      imageUrl: null,
      trending: true
    },
    {
      id: 2,
      title: 'Global Markets Rally on New Economic Data',
      summary: 'Stock markets worldwide see significant gains following unexpected positive economic indicators...',
      category: 'Economy',
      source: 'Financial Times',
      relevance: 88,
      timeAgo: '4 hours ago',
      imageUrl: null,
      trending: false
    },
    {
      id: 3,
      title: 'Renewable Energy Adoption Reaches Record Highs',
      summary: 'New report shows solar and wind power installations exceeded all previous records...',
      category: 'Energy',
      source: 'Reuters',
      relevance: 82,
      timeAgo: '6 hours ago',
      imageUrl: null,
      trending: true
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-400" />
            AI-Powered News Feed
          </h2>
          <p className="text-slate-400 mt-1">Personalized content based on your interests and reading habits</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Today\'s Articles', value: '24', icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
          { label: 'Reading Time', value: '2.5h', icon: Clock, color: 'from-green-500 to-emerald-500' },
          { label: 'Topics Followed', value: '12', icon: Target, color: 'from-purple-500 to-pink-500' },
          { label: 'Active Alerts', value: '5', icon: Zap, color: 'from-orange-500 to-red-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Personalized News Feed */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          Recommended for You
        </h3>

        {aiNews.map((news) => (
          <div key={news.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                  {news.category}
                </span>
                {news.trending && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <div className="w-full bg-slate-700 rounded-full h-1.5 w-16">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${news.relevance}%` }}
                    />
                  </div>
                  <span className="text-xs text-green-400 font-medium">{news.relevance}% match</span>
                </div>
              </div>
              <span className="text-slate-500 text-sm whitespace-nowrap">{news.timeAgo}</span>
            </div>

            <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors flex items-start justify-between">
              {news.title}
              <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </h4>

            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{news.summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Newspaper className="w-4 h-4" />
                  {news.source}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-all">
                  <Bookmark className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-all">
                  <Eye className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Analytics Tab - Advanced Analytics & Predictions
function AnalyticsTab({ profileData }: { profileData: any }) {
  const predictions = [
    { topic: 'AI & Machine Learning', growth: '+45%', confidence: 92, trend: 'up' },
    { topic: 'Climate Policy', growth: '+28%', confidence: 87, trend: 'up' },
    { topic: 'Cryptocurrency', growth: '-12%', confidence: 78, trend: 'down' },
    { topic: 'Space Exploration', growth: '+35%', confidence: 85, trend: 'up' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          Advanced Analytics & Predictions
        </h2>
        <p className="text-slate-400 mt-1">AI-powered insights into your reading patterns and trending topics</p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Time on Platform', value: '47h 32m', icon: Clock, color: 'from-blue-500 to-cyan-500', change: '+12%' },
          { label: 'Articles Read', value: '156', icon: FileText, color: 'from-green-500 to-emerald-500', change: '+23%' },
          { label: 'Average Session', value: '18m', icon: ActivityIcon, color: 'from-purple-500 to-pink-500', change: '+5%' }
        ].map((stat, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-medium">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Topic Predictions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          AI Trend Predictions (Next 30 Days)
        </h3>
        <div className="space-y-3">
          {predictions.map((pred, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    pred.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    <TrendingUp className={`w-5 h-5 ${pred.trend === 'down' ? 'rotate-180' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{pred.topic}</h4>
                    <p className="text-sm text-slate-400">Predicted growth in coverage</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${pred.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {pred.growth}
                  </div>
                  <p className="text-xs text-slate-500">Confidence: {pred.confidence}%</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${pred.trend === 'up' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
                  style={{ width: `${pred.confidence}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Your Reading Distribution</h3>
        <div className="space-y-3">
          {[
            { name: 'Technology & AI', count: 45, percentage: 35, color: 'from-blue-500 to-cyan-500' },
            { name: 'Economy & Markets', count: 32, percentage: 25, color: 'from-green-500 to-emerald-500' },
            { name: 'Energy & Resources', count: 28, percentage: 22, color: 'from-purple-500 to-pink-500' },
            { name: 'Politics & Diplomacy', count: 23, percentage: 18, color: 'from-orange-500 to-red-500' }
          ].map((category, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{category.name}</span>
                <span className="text-slate-400 text-sm">{category.count} articles</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div
                  className={`bg-gradient-to-r ${category.color} h-2.5 rounded-full`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Smart Alerts Tab
function SmartAlertsTab() {
  const [alerts, setAlerts] = useState([
    { id: 1, topic: 'Artificial Intelligence breakthroughs', type: 'keyword', isActive: true, frequency: 'instant', matches: 5 },
    { id: 2, topic: 'Tesla stock movements', type: 'company', isActive: true, frequency: 'daily', matches: 12 },
    { id: 3, topic: 'Climate change policy', type: 'topic', isActive: false, frequency: 'weekly', matches: 8 },
    { id: 4, topic: 'Cryptocurrency regulation', type: 'keyword', isActive: true, frequency: 'instant', matches: 3 }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            Smart Alerts
          </h2>
          <p className="text-slate-400 mt-1">Get notified about topics that matter to you</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Create Alert
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-medium text-lg">{alert.topic}</h3>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    {alert.type}
                  </span>
                  {alert.matches > 0 && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {alert.matches} new
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">
                  Frequency: <span className="text-white capitalize">{alert.frequency}</span> notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alert.isActive}
                  onChange={() => {
                    setAlerts(alerts.map(a => a.id === alert.id ? { ...a, isActive: !a.isActive } : a))
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Search History Tab
function SearchHistoryTab() {
  const searchHistory = [
    { id: 1, query: 'artificial intelligence quantum computing', results: 156, time: '2 hours ago', category: 'Technology' },
    { id: 2, query: 'climate change renewable energy', results: 234, time: '1 day ago', category: 'Energy' },
    { id: 3, query: 'stock market analysis 2025', results: 189, time: '2 days ago', category: 'Economy' },
    { id: 4, query: 'space exploration mars mission', results: 98, time: '3 days ago', category: 'Science' },
    { id: 5, query: 'cryptocurrency regulation news', results: 145, time: '5 days ago', category: 'Finance' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <History className="w-8 h-8 text-blue-400" />
            Search History
          </h2>
          <p className="text-slate-400 mt-1">Your past searches and discoveries</p>
        </div>
        <button className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        {searchHistory.map((search) => (
          <div key={search.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    "{search.query}"
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-slate-400 text-sm">{search.results} results</span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {search.category}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-slate-500 text-sm whitespace-nowrap">{search.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Chat Archives Tab Component
function ChatArchivesTab() {
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      const response = await fetch('/api/profile/chats')
      if (response.ok) {
        const data = await response.json()
        setChats(data.chats)
      }
    } catch (error) {
      console.error('Failed to load chats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            AI Chat History
          </h2>
          <p className="text-slate-400 mt-1">Your conversations with the AI assistant</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
          New Chat
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading chats...</div>
      ) : chats.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg mb-2">No chat history yet</h3>
          <p className="text-slate-400 mb-6">Start a conversation with our AI assistant!</p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
            Start Chatting
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <div key={chat.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{chat.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{chat.preview}</p>
                </div>
                <span className="text-slate-500 text-sm whitespace-nowrap ml-4">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Saved News Tab Component
function SavedNewsTab() {
  const [savedNews, setSavedNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSavedNews()
  }, [])

  const loadSavedNews = async () => {
    try {
      const response = await fetch('/api/profile/saved-news')
      if (response.ok) {
        const data = await response.json()
        setSavedNews(data.savedNews)
      }
    } catch (error) {
      console.error('Failed to load saved news:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-blue-400" />
          Saved News & Bookmarks
        </h2>
        <p className="text-slate-400 mt-1">Articles you've saved for later</p>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading saved news...</div>
      ) : savedNews.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Bookmark className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg mb-2">No saved articles yet</h3>
          <p className="text-slate-400">Bookmark articles you want to read later!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedNews.map((news) => (
            <div key={news.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="flex gap-4">
                {news.imageUrl && (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2">{news.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-2">{news.summary}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>{news.source}</span>
                    <span>•</span>
                    <span>{news.category}</span>
                    <span>•</span>
                    <span>{new Date(news.savedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Saved Filters Tab Component
function SavedFiltersTab() {
  const [filters, setFilters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFilters()
  }, [])

  const loadFilters = async () => {
    try {
      const response = await fetch('/api/profile/filters')
      if (response.ok) {
        const data = await response.json()
        setFilters(data.filters)
      }
    } catch (error) {
      console.error('Failed to load filters:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Filter className="w-8 h-8 text-green-400" />
            Saved Filters
          </h2>
          <p className="text-slate-400 mt-1">Quick access to your custom filters</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
          Create Filter
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading filters...</div>
      ) : filters.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Filter className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg mb-2">No saved filters yet</h3>
          <p className="text-slate-400">Create custom filters for quick access!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filters.map((filter) => (
            <div key={filter.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium">{filter.name}</h3>
                {filter.isDefault && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-3">{filter.description}</p>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                Apply Filter
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Subscriptions Tab Component
function SubscriptionsTab() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('/api/profile/subscriptions')
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions)
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSubscription = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/profile/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      loadSubscriptions()
    } catch (error) {
      console.error('Failed to toggle subscription:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-yellow-400" />
            Subscriptions
          </h2>
          <p className="text-slate-400 mt-1">Manage your topics, sources, and keywords</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
          Add Subscription
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading subscriptions...</div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg mb-2">No subscriptions yet</h3>
          <p className="text-slate-400">Subscribe to topics, sources, or keywords!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium">{sub.value}</h3>
                  <span className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded">
                    {sub.type}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">
                  Notifications: {sub.frequency}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sub.isActive}
                  onChange={() => toggleSubscription(sub.id, sub.isActive)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Settings Tab Component
function SettingsTab({ session }: { session: any }) {
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [profileImage, setProfileImage] = useState<string | null>(session?.user?.image || null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          image: profileImage
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-slate-400" />
          Account Settings
        </h2>
        <p className="text-slate-400 mt-1">Manage your profile and preferences</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          message.type === 'success'
            ? 'bg-green-500/10 border-green-500/50 text-green-400'
            : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Profile Picture */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-medium mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {formData.name?.charAt(0).toUpperCase() || formData.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-all shadow-lg">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Upload a new picture</p>
            <p className="text-slate-400 text-sm">JPG, PNG or GIF. Max size 2MB</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-medium mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-medium mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6">
        <h3 className="text-red-400 font-medium mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-slate-400 text-sm mb-4">Permanently delete your account and all data</p>
        <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all">
          Delete Account
        </button>
      </div>
    </div>
  )
}
