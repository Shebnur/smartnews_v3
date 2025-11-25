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
  TrendingUp
} from 'lucide-react'

type TabType = 'chats' | 'research' | 'activity' | 'filters' | 'saved' | 'subscriptions' | 'settings'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('activity')
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const tabs = [
    { id: 'chats' as TabType, label: 'AI Chat Archives', icon: MessageSquare },
    { id: 'research' as TabType, label: 'Research History', icon: FileSearch },
    { id: 'activity' as TabType, label: 'Activity', icon: ActivityIcon },
    { id: 'filters' as TabType, label: 'Saved Filters', icon: Filter },
    { id: 'saved' as TabType, label: 'Saved News', icon: Bookmark },
    { id: 'subscriptions' as TabType, label: 'Subscriptions', icon: Bell },
    { id: 'settings' as TabType, label: 'Settings', icon: User }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-slate-400 mt-1">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg p-6">
              {activeTab === 'activity' && <ActivityTab profileData={profileData} />}
              {activeTab === 'chats' && <ChatArchivesTab />}
              {activeTab === 'research' && <ResearchHistoryTab />}
              {activeTab === 'filters' && <SavedFiltersTab />}
              {activeTab === 'saved' && <SavedNewsTab />}
              {activeTab === 'subscriptions' && <SubscriptionsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Activity Tab Component
function ActivityTab({ profileData }: { profileData: any }) {
  const stats = [
    {
      label: 'Time Spent',
      value: profileData?.totalTimeSpent || '0h',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Articles Read',
      value: profileData?.articlesRead || 0,
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Research Projects',
      value: profileData?.researchCount || 0,
      icon: FileSearch,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'AI Chats',
      value: profileData?.chatCount || 0,
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Activity Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top Categories */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Top Categories Read</h3>
        <div className="space-y-3">
          {(profileData?.topCategories || [
            { name: 'Technology & AI', count: 45, percentage: 35 },
            { name: 'Economy & Markets', count: 32, percentage: 25 },
            { name: 'Energy & Resources', count: 28, percentage: 22 },
            { name: 'Politics & Diplomacy', count: 23, percentage: 18 }
          ]).map((category: any, index: number) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{category.name}</span>
                <span className="text-slate-400 text-sm">{category.count} articles</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {(profileData?.recentActivities || []).length === 0 ? (
            <div className="text-slate-400 text-center py-8">
              No recent activity yet. Start exploring news!
            </div>
          ) : (
            profileData.recentActivities.map((activity: any, index: number) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ActivityIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.title}</div>
                  <div className="text-slate-400 text-sm">{activity.type} • {activity.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
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
        <h2 className="text-2xl font-bold text-white">AI Chat Archives</h2>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
          New Chat
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading chats...</div>
      ) : chats.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No chat history yet. Start a conversation with our AI assistant!
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <div key={chat.id} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-all cursor-pointer">
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

// Research History Tab Component
function ResearchHistoryTab() {
  const [researches, setResearches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResearches()
  }, [])

  const loadResearches = async () => {
    try {
      const response = await fetch('/api/profile/research')
      if (response.ok) {
        const data = await response.json()
        setResearches(data.researches)
      }
    } catch (error) {
      console.error('Failed to load researches:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Research History</h2>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading research history...</div>
      ) : researches.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No research history yet. Start researching topics!
        </div>
      ) : (
        <div className="space-y-3">
          {researches.map((research) => (
            <div key={research.id} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium">{research.title}</h3>
                <span className="text-slate-500 text-sm whitespace-nowrap ml-4">
                  {new Date(research.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-2">{research.query}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>{research.articlesCount} articles found</span>
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
        <h2 className="text-2xl font-bold text-white">Saved Filters</h2>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
          Create Filter
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading filters...</div>
      ) : filters.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No saved filters yet. Create custom filters for quick access!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filters.map((filter) => (
            <div key={filter.id} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium">{filter.name}</h3>
                {filter.isDefault && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-3">{filter.description}</p>
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                Apply Filter
              </button>
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
      <h2 className="text-2xl font-bold text-white">Saved News & Bookmarks</h2>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading saved news...</div>
      ) : savedNews.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No saved articles yet. Bookmark articles you want to read later!
        </div>
      ) : (
        <div className="space-y-3">
          {savedNews.map((news) => (
            <div key={news.id} className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-all">
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
        <h2 className="text-2xl font-bold text-white">Subscriptions & Alerts</h2>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
          Add Subscription
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-8">Loading subscriptions...</div>
      ) : subscriptions.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No subscriptions yet. Subscribe to topics, sources, or keywords!
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
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
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Settings Tab Component
function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Account Settings</h2>

      <div className="space-y-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Profile Information</h3>
          <p className="text-slate-400 text-sm mb-4">Update your account information</p>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
            Edit Profile
          </button>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Password</h3>
          <p className="text-slate-400 text-sm mb-4">Change your password</p>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
            Change Password
          </button>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Email Preferences</h3>
          <p className="text-slate-400 text-sm mb-4">Manage your email notification preferences</p>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-slate-300 text-sm">Daily news digest</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span className="text-slate-300 text-sm">Breaking news alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-slate-300 text-sm">Weekly summary</span>
            </label>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <h3 className="text-red-500 font-medium mb-2">Danger Zone</h3>
          <p className="text-slate-400 text-sm mb-4">Permanently delete your account and all data</p>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
