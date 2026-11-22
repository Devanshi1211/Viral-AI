'use client'

import { useState, useEffect, useRef } from 'react'
import { TrendingUp, Zap, Users, Clock, ArrowUp } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface DashboardMetrics {
  trendingTopics: { value: string; change: string }
  viralScore: { value: string; change: string }
  engagement: { value: string; change: string }
  bestPostingTime: { value: string; label: string }
  sparklineData: number[]
}

// Animated counter hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) return
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  return count
}

export function OverviewCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  const rawTopics = parseInt(metrics?.trendingTopics.value || '0') || 10
  const rawScore  = parseFloat(metrics?.viralScore.value || '0') || 82
  const rawEngage = metrics?.engagement.value || '66.5K'
  const rawTime   = metrics?.bestPostingTime.value || '8:00 PM'

  const topicsCount = useCountUp(rawTopics)
  const scoreCount  = useCountUp(Math.round(rawScore))

  const sparkline = (metrics?.sparklineData || [40, 45, 38, 52, 48, 61, 58]).map(
    (v) => ({ value: v })
  )

  const cards = [
    {
      id: 'card-trending-topics',
      title: 'Trending Topics',
      icon: TrendingUp,
      value: loading ? null : `${topicsCount}`,
      unit: 'trending topics',
      change: metrics?.trendingTopics.change || '+12%',
      gradient: 'from-violet-500 to-purple-600',
      accent: 'oklch(0.68 0.25 260)',
      positive: true,
    },
    {
      id: 'card-viral-score',
      title: 'Avg. Viral Score',
      icon: Zap,
      value: loading ? null : `${scoreCount}`,
      unit: 'out of 100',
      change: metrics?.viralScore.change || '+5%',
      gradient: 'from-blue-500 to-cyan-500',
      accent: 'oklch(0.68 0.22 225)',
      positive: true,
    },
    {
      id: 'card-engagement',
      title: 'Audience Engagement',
      icon: Users,
      value: loading ? null : rawEngage,
      unit: 'interactions',
      change: metrics?.engagement.change || '+18%',
      gradient: 'from-emerald-500 to-teal-500',
      accent: 'oklch(0.72 0.19 165)',
      positive: true,
    },
    {
      id: 'card-best-time',
      title: 'Best Posting Time',
      icon: Clock,
      value: loading ? null : rawTime,
      unit: metrics?.bestPostingTime.label || 'Peak engagement',
      change: 'Updated today',
      gradient: 'from-orange-500 to-amber-500',
      accent: 'oklch(0.72 0.18 60)',
      positive: false,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            id={card.id}
            className="vi-card"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Subtle gradient background */}
            <div
              className={`absolute inset-0 rounded-[1rem] bg-gradient-to-br ${card.gradient} opacity-[0.04] pointer-events-none`}
            />

            <div className="relative flex flex-col gap-3">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                <div
                  className={`rounded-lg bg-gradient-to-br ${card.gradient} p-2 flex-shrink-0`}
                  style={{ boxShadow: `0 4px 12px ${card.accent}40` }}
                >
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              {/* Value */}
              <div>
                {loading ? (
                  <div className="space-y-2">
                    <div className="skeleton h-8 w-24 rounded" />
                    <div className="skeleton h-3 w-16 rounded" />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold tracking-tight animate-count-up">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.unit}</p>
                  </>
                )}
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
                {/* Sparkline */}
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkline}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={card.accent}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Change badge */}
                {card.positive ? (
                  <span
                    className="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${card.accent}18`,
                      color: card.accent,
                    }}
                  >
                    <ArrowUp className="h-2.5 w-2.5" />
                    {card.change}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">{card.change}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
