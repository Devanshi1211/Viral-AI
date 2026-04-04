'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  TrendingUp,
  BookmarkPlus,
  Loader2,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const defaultChartData = [
  { day: 'Mon', volume: 400 },
  { day: 'Tue', volume: 520 },
  { day: 'Wed', volume: 680 },
  { day: 'Thu', volume: 750 },
  { day: 'Fri', volume: 890 },
  { day: 'Sat', volume: 1200 },
  { day: 'Sun', volume: 950 },
]

interface TrendItem {
  rank: number
  topic: string
  platform: string
  momentum: string
  description: string
}

export default function TrendsPage() {
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [savedTrends, setSavedTrends] = useState<string[]>([])
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const handleAnalyze = async () => {
    const searchNiche = niche.trim() || 'social media and content creation'
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: searchNiche }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Trend analysis failed')
      }

      const text = data.text || ''
      setAiAnalysis(text)

      // Parse trends from AI response
      const parsed = parseTrends(text)
      setTrends(parsed)
      setHasAnalyzed(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function parseTrends(text: string): TrendItem[] {
    const items: TrendItem[] = []
    const lines = text.split('\n')
    let rank = 1

    for (const line of lines) {
      const cleaned = line.replace(/^[\d\.\-\*•]+\s*/, '').replace(/\*\*/g, '').trim()
      if (cleaned.length > 15 && cleaned.length < 200 && rank <= 10) {
        // Detect platform from content
        let detectedPlatform = 'All'
        if (/instagram|reel|story/i.test(cleaned)) detectedPlatform = 'Instagram'
        else if (/twitter|tweet|thread|x\b/i.test(cleaned)) detectedPlatform = 'Twitter'
        else if (/youtube|video|short/i.test(cleaned)) detectedPlatform = 'YouTube'
        else if (/tiktok/i.test(cleaned)) detectedPlatform = 'TikTok'

        // Detect momentum
        let momentum = 'Medium'
        if (/viral|exploding|surge|boom|hot/i.test(cleaned)) momentum = 'High'
        else if (/emerging|rising|growing/i.test(cleaned)) momentum = 'Rising'
        else if (/stable|steady|consistent/i.test(cleaned)) momentum = 'Stable'

        items.push({
          rank: rank++,
          topic: cleaned.length > 80 ? cleaned.substring(0, 80) + '...' : cleaned,
          platform: detectedPlatform,
          momentum,
          description: cleaned,
        })
      }
    }

    return items.slice(0, 8)
  }

  const toggleSave = (topic: string) => {
    setSavedTrends((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    )
  }

  const getMomentumColor = (m: string) => {
    switch (m) {
      case 'High': return 'bg-green-500/20 text-green-400'
      case 'Rising': return 'bg-blue-500/20 text-blue-400'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />

      <main className="ml-64 mt-16 p-6">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Trend Explorer</h1>
            <p className="text-muted-foreground mt-2">
              Discover and analyze trending topics across all social platforms with AI
            </p>
          </div>

          {/* Search + Analyze */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter niche (e.g., Tech, Fashion, Finance)..."
                  className="pl-10 h-10 bg-muted"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-48 h-10 bg-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Trends
                </>
              )}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card">
              <h3 className="text-lg font-bold mb-4">Trend Volume (This Week)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={defaultChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: `1px solid var(--border)`,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card">
              <h3 className="text-lg font-bold mb-4">Trends by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={defaultChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: `1px solid var(--border)`,
                    }}
                  />
                  <Bar dataKey="volume" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trending Table */}
          <div className="glass-card">
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trending">
                  {hasAnalyzed ? 'AI Trends' : 'Trending Now'}
                </TabsTrigger>
                <TabsTrigger value="analysis">Full Analysis</TabsTrigger>
                <TabsTrigger value="saved">Saved ({savedTrends.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="space-y-3 mt-6">
                {!hasAnalyzed ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">
                      Enter a niche above and click &quot;Analyze Trends&quot; to get AI-powered insights
                    </p>
                    <Button onClick={handleAnalyze} variant="outline" disabled={loading}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Now
                    </Button>
                  </div>
                ) : trends.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-4 font-semibold">Rank</th>
                          <th className="text-left py-3 px-4 font-semibold">Topic</th>
                          <th className="text-left py-3 px-4 font-semibold">Platform</th>
                          <th className="text-left py-3 px-4 font-semibold">Momentum</th>
                          <th className="text-left py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trends
                          .filter(
                            (t) => platform === 'all' || t.platform.toLowerCase().includes(platform)
                          )
                          .map((trend) => (
                            <tr
                              key={trend.rank}
                              className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <span className="font-bold text-primary">
                                  #{trend.rank}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-medium max-w-md">
                                {trend.topic}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 rounded-full bg-muted/50 text-xs">
                                  {trend.platform}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${getMomentumColor(
                                    trend.momentum
                                  )}`}
                                >
                                  {trend.momentum}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSave(trend.topic)}
                                  className={
                                    savedTrends.includes(trend.topic)
                                      ? 'text-yellow-500'
                                      : ''
                                  }
                                >
                                  <BookmarkPlus className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No trends found. Try a different niche.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="space-y-3 mt-6">
                {aiAnalysis ? (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-semibold text-sm">
                        AI Trend Analysis — {niche || 'General'}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAnalyze}
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                      {aiAnalysis}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      Run trend analysis to see full AI insights here
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved" className="space-y-3 mt-6">
                {savedTrends.length > 0 ? (
                  <div className="grid gap-3">
                    {savedTrends.map((trend) => (
                      <div
                        key={trend}
                        className="p-3 rounded-lg bg-muted/30 flex items-center justify-between"
                      >
                        <span className="font-medium text-sm">{trend}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSave(trend)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookmarkPlus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      No saved trends yet. Start bookmarking!
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
