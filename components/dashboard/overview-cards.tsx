'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Zap, Users, Clock } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface DashboardMetrics {
  trendingTopics: { value: string; change: string }
  viralScore: { value: string; change: string }
  engagement: { value: string; change: string }
  bestPostingTime: { value: string; label: string }
  sparklineData: number[]
}

export function OverviewCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/dashboard')
        const data = await res.json()
        if (data.success) {
          setMetrics(data.metrics)
        }
      } catch {
        console.error('Failed to load dashboard metrics')
      }
    }
    fetchMetrics()
  }, [])

  const cards = [
    {
      title: 'Trending Topics Today',
      icon: TrendingUp,
      value: metrics?.trendingTopics.value || '—',
      unit: 'topics',
      change: metrics?.trendingTopics.change || '—',
      positive: true,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Predicted Viral Score',
      icon: Zap,
      value: metrics?.viralScore.value || '—',
      unit: '/100',
      change: metrics?.viralScore.change || '—',
      positive: true,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Audience Engagement',
      icon: Users,
      value: metrics?.engagement.value || '—',
      unit: 'interactions',
      change: metrics?.engagement.change || '—',
      positive: true,
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      title: 'Best Posting Time',
      icon: Clock,
      value: metrics?.bestPostingTime.value || '—',
      unit: metrics?.bestPostingTime.label || 'peak hour',
      change: 'Updated today',
      positive: false,
      color: 'from-indigo-500 to-indigo-600',
    },
  ]

  const sparkline = (metrics?.sparklineData || [40, 45, 38, 52, 48, 61]).map(
    (v) => ({ value: v })
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="glass-card group relative overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />

            <div className="relative flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </div>
                <div className={`rounded-lg bg-gradient-to-br ${card.color} p-2`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>

              <div>
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.unit}</p>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-border/30">
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkline}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="currentColor"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <span
                  className={`text-xs font-medium ${
                    card.positive ? 'text-green-500' : 'text-muted-foreground'
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
