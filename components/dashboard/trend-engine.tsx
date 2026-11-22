'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2, TrendingUp, ArrowRight, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TrendItem {
  hashtag: string
  platform: string
  strength: string
  count: string
  engagementScore: number
}

const platformColor: Record<string, string> = {
  Instagram: 'from-pink-500 to-rose-500',
  Twitter: 'from-blue-500 to-cyan-500',
  YouTube: 'from-red-500 to-orange-500',
  All: 'from-violet-500 to-purple-500',
}

const strengthStyle: Record<string, { bg: string; color: string; icon: boolean }> = {
  High:   { bg: 'oklch(0.72 0.19 150 / 0.12)', color: 'oklch(0.72 0.19 150)', icon: true },
  Medium: { bg: 'oklch(0.78 0.17 65 / 0.12)',  color: 'oklch(0.78 0.17 65)',  icon: false },
  Low:    { bg: 'oklch(0.55 0.04 280 / 0.12)', color: 'oklch(0.55 0.04 280)', icon: false },
}

export function TrendEngine() {
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [search, setSearch] = useState('')
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await fetch('/api/dashboard')
        const data = await res.json()
        if (data.success && data.topHashtags) {
          setTrends(data.topHashtags)
        }
      } catch {
        console.error('Failed to load trends')
      } finally {
        setLoading(false)
      }
    }
    fetchTrends()
  }, [])

  const filteredTrends = trends.filter((t) => {
    if (selectedPlatform !== 'all' && t.platform !== selectedPlatform) return false
    if (search && !t.hashtag.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="vi-card h-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold">Trend Explorer</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time trending hashtags
          </p>
        </div>
        <div
          className="rounded-lg p-2"
          style={{ background: 'oklch(0.68 0.25 260 / 0.12)', color: 'oklch(0.68 0.25 260)' }}
        >
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trends..."
            className="pl-8 h-8 text-sm bg-muted"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-32 h-8 text-xs bg-muted">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Twitter">Twitter/X</SelectItem>
            <SelectItem value="YouTube">YouTube</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trend List */}
      <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredTrends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No trends found</p>
          </div>
        ) : (
          filteredTrends.map((trend, i) => {
            const gradKey = trend.platform in platformColor ? trend.platform : 'All'
            const gradClass = platformColor[gradKey]
            const strength = strengthStyle[trend.strength] || strengthStyle.Low

            return (
              <div
                key={i}
                className="group flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-200 hover:bg-muted/40 cursor-pointer"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank */}
                  <span className="text-xs font-bold text-muted-foreground w-4 flex-shrink-0">
                    #{i + 1}
                  </span>

                  {/* Platform dot */}
                  <div
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${gradClass} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {trend.platform.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'oklch(0.68 0.25 260)' }}>
                      {trend.hashtag}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {trend.count} posts · Score {trend.engagementScore.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Strength badge */}
                  <span
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: strength.bg, color: strength.color }}
                  >
                    {strength.icon && <Flame className="h-2.5 w-2.5" />}
                    {trend.strength}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* View All */}
      <Button
        variant="outline"
        className="w-full h-9 text-sm rounded-xl group"
        onClick={() => (window.location.href = '/trends')}
        id="trend-engine-view-all"
      >
        <span>View All Trends</span>
        <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </div>
  )
}
