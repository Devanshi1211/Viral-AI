'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Download, Calendar, Loader2, RefreshCw } from 'lucide-react'

interface AnalyticsData {
  metrics: {
    totalPosts?: number
    totalLikes: number
    totalComments: number
    totalShares?: number
    totalRetweets?: number
    totalReplies?: number
    totalViews?: number
    avgEngagementRate: number
    totalReach?: number
  }
  formattedMetrics: Record<string, string>
  topPosts?: { title: string; likes: number; comments: number; shares?: number; retweets?: number }[]
  topVideos?: { title: string; views: number; likes: number; comments: number }[]
  topTweets?: { text: string; likes: number; retweets: number; replies: number }[]
  contentTypes?: { type: string; engagement: number; reach: number }[]
  trends?: { date: string; likes: number; comments: number; shares: number }[]
  categories?: { name: string; value: number }[]
}

const platformColors: Record<string, string> = {
  Instagram: '#E4405F',
  Twitter: '#1DA1F2',
  YouTube: '#FF0000',
  TikTok: '#000000',
}

export default function AnalyticsPage() {
  const [platform, setPlatform] = useState('instagram')
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [platform])

  async function fetchAnalytics() {
    setLoading(true)
    try {
      const endpoint =
        platform === 'all'
          ? '/api/instagram/analysis'
          : `/api/${platform}/analysis`
      const res = await fetch(endpoint)
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    } catch {
      console.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  // Derive display values
  const keyMetrics = data
    ? [
        {
          label: 'Total Likes',
          value: data.formattedMetrics.totalLikes || '—',
          change: '+12%',
        },
        {
          label: 'Total Comments',
          value: data.formattedMetrics.totalComments || '—',
          change: '+8%',
        },
        {
          label:
            platform === 'twitter'
              ? 'Total Retweets'
              : platform === 'youtube'
                ? 'Total Views'
                : 'Total Shares',
          value:
            data.formattedMetrics.totalShares ||
            data.formattedMetrics.totalRetweets ||
            data.formattedMetrics.totalViews ||
            '—',
          change: '+18%',
        },
        {
          label: 'Avg Engagement',
          value: data.formattedMetrics.avgEngagement || `${data.metrics.avgEngagementRate}%`,
          change: '+2.1%',
        },
      ]
    : []

  // Top posts
  const topItems = data?.topPosts || data?.topVideos?.map((v) => ({
    title: v.title,
    likes: v.likes,
    comments: v.comments,
    shares: v.views,
    platform: 'YouTube',
  })) || data?.topTweets?.map((t) => ({
    title: t.text,
    likes: t.likes,
    comments: t.replies,
    shares: t.retweets,
    platform: 'Twitter',
  })) || []

  // Engagement trend data
  const trendData = data?.trends || [
    { date: 'Week 1', likes: 400, comments: 240, shares: 120 },
    { date: 'Week 2', likes: 520, comments: 320, shares: 180 },
    { date: 'Week 3', likes: 680, comments: 420, shares: 280 },
    { date: 'Week 4', likes: 850, comments: 580, shares: 350 },
  ]

  // Content type data
  const contentTypeData = data?.contentTypes || [
    { type: 'Reels', engagement: 8500, reach: 45000 },
    { type: 'Carousel', engagement: 5200, reach: 28000 },
    { type: 'Stories', engagement: 3200, reach: 18000 },
    { type: 'Feed Posts', engagement: 4100, reach: 22000 },
  ]

  // Platform distribution
  const platformDist = [
    { name: 'Instagram', value: 45, color: '#E4405F' },
    { name: 'Twitter', value: 30, color: '#1DA1F2' },
    { name: 'YouTube', value: 20, color: '#FF0000' },
    { name: 'TikTok', value: 5, color: '#69C9D0' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />

      <main className="ml-64 mt-16 p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Track performance across all your content
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-40 h-10 bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 h-10 bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Custom Date
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading analytics...</span>
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {keyMetrics.map((metric) => (
                  <div key={metric.label} className="glass-card">
                    <p className="text-sm text-muted-foreground mb-2">
                      {metric.label}
                    </p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <p className="text-xs text-green-500 font-medium mt-2">
                      {metric.change} from last period
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Engagement Over Time */}
                <div className="lg:col-span-2 glass-card">
                  <h3 className="text-lg font-bold mb-4">Engagement Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="likes"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--primary)' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="comments"
                        stroke="var(--secondary)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--secondary)' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="shares"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--accent)' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Platform Distribution */}
                <div className="glass-card">
                  <h3 className="text-lg font-bold mb-4">Platform Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={platformDist}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {platformDist.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    {platformDist.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance by Content Type */}
              <div className="glass-card">
                <h3 className="text-lg font-bold mb-4">
                  Performance by Content Type
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contentTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="type" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="engagement"
                      fill="var(--primary)"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="reach"
                      fill="var(--secondary)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Performing Posts */}
              <div className="glass-card">
                <h3 className="text-lg font-bold mb-4">Top Performing Posts</h3>
                <div className="space-y-3">
                  {topItems.map((post, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {post.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-semibold">
                            {post.likes.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Likes</p>
                        </div>
                      </div>
                      <div className="flex gap-8 mt-3 text-xs text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground">
                            {post.comments?.toLocaleString() || '—'}
                          </p>
                          <p>Comments</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {(post.shares || 0).toLocaleString()}
                          </p>
                          <p>{platform === 'twitter' ? 'Retweets' : 'Shares'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
