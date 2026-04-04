'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
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

  const filteredTrends = trends
    .filter((t) => {
      if (selectedPlatform !== 'all' && t.platform !== selectedPlatform) return false
      if (search && !t.hashtag.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

  const strengthColor = (strength: string) => {
    switch (strength) {
      case 'High':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="glass-card">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold mb-2">Trend Detection Engine</h2>
          <p className="text-sm text-muted-foreground">
            Real-time trending hashtags and topics across platforms
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search trends..."
                className="pl-10 h-10 bg-muted"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40 h-10 bg-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Twitter">Twitter/X</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trends Grid */}
        <div className="grid gap-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTrends.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No trends found
            </p>
          ) : (
            filteredTrends.map((trend, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <code className="text-sm font-semibold text-primary">
                      {trend.hashtag}
                    </code>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {trend.platform}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${strengthColor(
                        trend.strength
                      )}`}
                    >
                      {trend.strength}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {trend.count} posts • Score: {trend.engagementScore.toFixed(1)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Add
                </Button>
              </div>
            ))
          )}
        </div>

        {/* View All */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => (window.location.href = '/trends')}
        >
          View All Trends
        </Button>
      </div>
    </div>
  )
}
