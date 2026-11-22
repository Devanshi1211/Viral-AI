'use client'

import { useState } from 'react'
import {
  Sparkles, Loader2, RotateCcw, TrendingUp, TrendingDown, Minus,
  AlertTriangle, RefreshCw, Target, Brain, Zap, Clock,
  MessageCircle, Heart, Share2, Hash, Eye, BarChart2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TopFactor {
  feature: string
  coefficient: number
  influence: number
}

interface FactorRow {
  factor: string
  current: string
  status: 'Low' | 'Moderate' | 'Good' | 'Excellent' | 'Too short' | 'Too long' | 'Poor' | 'Optimal'
  recommendation: string
}

interface ViralityScores {
  overall: number
  model: string
  topFactors: TopFactor[]
  factorRows: FactorRow[]
  format: string
  engagement: string
}

// ─── Feature Extraction ──────────────────────────────────────────────────────

function extractFeatures(input: string) {
  const trimmed = input.trim()
  const words = trimmed.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const charCount = trimmed.length

  // Hashtags explicitly written by the user
  const explicitHashtags = (trimmed.match(/#\w+/g) || []).length

  // Keyword richness — count unique "meaningful" words (> 4 chars)
  const meaningfulWords = words.filter(w => w.replace(/[^a-zA-Z]/g, '').length > 4)
  const uniqueRatio = new Set(meaningfulWords.map(w => w.toLowerCase())).size / Math.max(meaningfulWords.length, 1)

  // Question mark presence implies engagement/CTA intent
  const hasQuestion = /\?/.test(trimmed)

  // Exclamations imply high energy / hook
  const exclamations = (trimmed.match(/!/g) || []).length

  // Number of list-like elements (numbered or bullet points)
  const listItems = (trimmed.match(/(\d+[\.]\s|\n[-•])/g) || []).length

  // --- Simulated engagement metrics based on content richness ---

  // Watch time: longer, richer content = more watch time (cap 300s)
  const watchTime = Math.min(300, 5 + wordCount * 3 + listItems * 10 + (hasQuestion ? 15 : 0))

  // Hashtags for ML: use explicit ones, or estimate from topic richness
  const hashtagsCount = explicitHashtags > 0
    ? Math.min(explicitHashtags, 15)
    : Math.min(5, Math.floor(meaningfulWords.length / 3))

  // Engagement rate: questions, lists, unique vocab all improve engagement
  const engagementRate = Math.min(25,
    1.5
    + (hasQuestion ? 3 : 0)
    + (exclamations > 0 ? 1 : 0)
    + uniqueRatio * 4
    + listItems * 1.5
    + hashtagsCount * 0.4
  )

  // Likes: combination of engagement and content length
  const likes = Math.min(10000, Math.floor(
    300 + wordCount * 30 + listItems * 200 + (hasQuestion ? 400 : 0) + exclamations * 100
  ))

  // Comments driven by questions and list interactivity
  const comments = Math.floor(likes * (hasQuestion ? 0.15 : 0.07))

  // Shares: relatable/useful content (lists, questions) gets shared more
  const shares = Math.floor(likes * (listItems > 0 ? 0.08 : 0.04) + (hasQuestion ? 50 : 0))

  // Posting hour: default to 20 (8 PM) — peak social media time
  const postingHour = 20

  // Caption length: raw character count
  const captionLength = charCount

  return {
    likes,
    comments,
    shares,
    watchTime,
    captionLength,
    hashtagsCount,
    postingHour,
    engagementRate,
  }
}

// ─── Factor Analysis ─────────────────────────────────────────────────────────

function buildFactorRows(features: ReturnType<typeof extractFeatures>): FactorRow[] {
  const rows: FactorRow[] = []

  // Engagement Rate
  const er = features.engagementRate
  rows.push({
    factor: 'Engagement Rate',
    current: `${er.toFixed(1)}%`,
    status: er >= 10 ? 'Excellent' : er >= 5 ? 'Good' : er >= 2.5 ? 'Moderate' : 'Low',
    recommendation:
      er < 2.5
        ? 'Encourage comments with a question or strong CTA.'
        : er < 5
        ? 'Add more interactive elements like polls or questions.'
        : er < 10
        ? 'Good engagement — try A/B testing hooks to push higher.'
        : 'Excellent engagement rate. Keep this style.',
  })

  // Likes
  const l = features.likes
  rows.push({
    factor: 'Likes',
    current: l.toLocaleString(),
    status: l >= 5000 ? 'Excellent' : l >= 2000 ? 'Good' : l >= 800 ? 'Moderate' : 'Low',
    recommendation:
      l < 800
        ? 'Improve the opening hook and visual appeal.'
        : l < 2000
        ? 'Add a stronger emotional or curiosity-driven headline.'
        : l < 5000
        ? 'Good performance — use trending audio or visuals to push further.'
        : 'Excellent. Maintain the content formula.',
  })

  // Shares
  const s = features.shares
  rows.push({
    factor: 'Shares',
    current: s.toLocaleString(),
    status: s >= 300 ? 'Excellent' : s >= 100 ? 'Good' : s >= 40 ? 'Moderate' : 'Low',
    recommendation:
      s < 40
        ? 'Create useful, relatable or save-worthy content.'
        : s < 100
        ? 'Add a "share this if…" CTA or create informational lists.'
        : s < 300
        ? 'Good share rate — consider making the content more evergreen.'
        : 'High shareability. Keep the informative/relatable angle.',
  })

  // Comments
  const c = features.comments
  rows.push({
    factor: 'Comments',
    current: c.toLocaleString(),
    status: c >= 200 ? 'Excellent' : c >= 80 ? 'Good' : c >= 30 ? 'Moderate' : 'Low',
    recommendation:
      c < 30
        ? 'Ask an opinion-based question to spark discussion.'
        : c < 80
        ? 'Reply to early comments to boost algorithmic reach.'
        : c < 200
        ? 'Good discussion — try controversial or debatable takes.'
        : 'High comment volume. Keep the engaging tone.',
  })

  // Watch Time
  const wt = features.watchTime
  rows.push({
    factor: 'Watch Time',
    current: `${wt}s`,
    status: wt >= 120 ? 'Excellent' : wt >= 60 ? 'Good' : wt >= 30 ? 'Moderate' : 'Low',
    recommendation:
      wt < 30
        ? 'Make the first 3 seconds more compelling to retain viewers.'
        : wt < 60
        ? 'Shorten unnecessary sections and improve pacing.'
        : wt < 120
        ? 'Decent retention — add B-roll or on-screen text to boost it.'
        : 'Strong watch time. Maintain the content length and pacing.',
  })

  // Caption Length
  const cl = features.captionLength
  rows.push({
    factor: 'Caption Length',
    current: `${cl} chars`,
    status:
      cl > 400
        ? 'Too long'
        : cl >= 100
        ? 'Good'
        : cl >= 30
        ? 'Moderate'
        : 'Too short',
    recommendation:
      cl > 400
        ? 'Make the caption shorter and more focused.'
        : cl < 30
        ? 'Add more context — a short hook + 1 CTA works well.'
        : cl < 100
        ? 'Good length — try adding a CTA or hashtags.'
        : 'Ideal caption length for engagement.',
  })

  // Hashtags
  const h = features.hashtagsCount
  rows.push({
    factor: 'Hashtags',
    current: h.toString(),
    status: h >= 5 && h <= 10 ? 'Excellent' : h >= 2 ? 'Moderate' : 'Low',
    recommendation:
      h < 2
        ? 'Add 3–5 highly relevant/trending hashtags.'
        : h > 10
        ? 'Too many hashtags may look spammy — aim for 3–7.'
        : h < 5
        ? 'Use 3–5 relevant or trending hashtags for better reach.'
        : 'Good hashtag use. Rotate with trending ones weekly.',
  })

  // Posting Hour
  const ph = features.postingHour
  const isPeakHour = ph >= 18 && ph <= 22
  rows.push({
    factor: 'Posting Time',
    current: `${ph}:00`,
    status: isPeakHour ? 'Optimal' : 'Poor',
    recommendation: isPeakHour
      ? 'Great posting time — evening hours drive high engagement.'
      : 'Post around 7–10 PM for peak audience activity.',
  })

  return rows
}

// ─── Human-friendly feature name map ─────────────────────────────────────────

const FEATURE_LABELS: Record<string, string> = {
  engagementRate: 'Engagement Rate',
  watchTime:      'Watch Time',
  captionLength:  'Caption Length',
  hashtagsCount:  'Hashtag Count',
  postingHour:    'Posting Time',
  likes:          'Likes',
  comments:       'Comments',
  shares:         'Shares',
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  engagementRate: <BarChart2 className="h-4 w-4" />,
  watchTime:      <Clock className="h-4 w-4" />,
  captionLength:  <Eye className="h-4 w-4" />,
  hashtagsCount:  <Hash className="h-4 w-4" />,
  postingHour:    <Clock className="h-4 w-4" />,
  likes:          <Heart className="h-4 w-4" />,
  comments:       <MessageCircle className="h-4 w-4" />,
  shares:         <Share2 className="h-4 w-4" />,
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: FactorRow['status'] }) {
  const map: Record<FactorRow['status'], string> = {
    Excellent:  'stat-badge-green',
    Good:       'stat-badge-blue',
    Moderate:   'stat-badge-yellow',
    Optimal:    'stat-badge-green',
    Low:        'stat-badge-red',
    Poor:       'stat-badge-red',
    'Too long': 'stat-badge-orange',
    'Too short':'stat-badge-orange',
  }
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${map[status]}`}>
      {status}
    </span>
  )
}

// ─── Score circle SVG ─────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const ringColor =
    score >= 80 ? 'oklch(0.72 0.19 150)' :
    score >= 60 ? 'oklch(0.78 0.18 130)' :
    score >= 40 ? 'oklch(0.78 0.17 65)' :
                  'oklch(0.65 0.22 25)'

  const ringClass =
    score >= 80 ? 'score-high' :
    score >= 60 ? 'score-good' :
    score >= 40 ? 'score-moderate' :
                  'score-low'

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        {/* Track */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="oklch(0.22 0.02 280)"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${ringColor}60)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${ringClass}`}>{score}</span>
        <span className="text-xs text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  )
}

// ─── Score explanation ────────────────────────────────────────────────────────

function getScoreExplanation(score: number): { tier: string; color: string; explanation: string } {
  if (score >= 80) return {
    tier: 'High Viral Potential',
    color: 'oklch(0.72 0.19 150)',
    explanation: 'Your content shows strong viral signals. The engagement rate, watch time, and interaction metrics suggest this has a high probability of reaching a wide audience.',
  }
  if (score >= 60) return {
    tier: 'Good Potential',
    color: 'oklch(0.78 0.18 130)',
    explanation: 'Your content has solid potential. A few improvements — particularly around engagement hooks and watch time — could push this into high-viral territory.',
  }
  if (score >= 40) return {
    tier: 'Needs Improvement',
    color: 'oklch(0.78 0.17 65)',
    explanation: 'Your content currently has moderate viral potential. Increasing engagement, improving the hook, and encouraging comments could significantly boost the predicted score.',
  }
  return {
    tier: 'Low Potential',
    color: 'oklch(0.65 0.22 25)',
    explanation: 'The current content signals are below average. Focus on improving the opening hook, adding a clear CTA, optimizing caption length, and using relevant hashtags to improve your score.',
  }
}

// ─── Platform pills ───────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: 'Instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'YouTube',   label: 'YouTube',   color: '#FF0000' },
  { id: 'Twitter',   label: 'X / Twitter', color: '#1D9BF0' },
  { id: 'TikTok',    label: 'TikTok',    color: '#69C9D0' },
]

// ─── Recommendation cards ─────────────────────────────────────────────────────

interface RecCard {
  icon: React.ReactNode
  title: string
  body: string
  color: string
}

function buildRecommendationCards(factorRows: FactorRow[]): RecCard[] {
  const cards: RecCard[] = []

  factorRows.forEach((row) => {
    if (row.status === 'Low' || row.status === 'Poor' || row.status === 'Too short' || row.status === 'Too long') {
      const iconMap: Record<string, React.ReactNode> = {
        'Engagement Rate': <Zap className="h-4 w-4" />,
        'Watch Time':      <Clock className="h-4 w-4" />,
        'Caption Length':  <Eye className="h-4 w-4" />,
        'Hashtags':        <Hash className="h-4 w-4" />,
        'Posting Time':    <Clock className="h-4 w-4" />,
        'Likes':           <Heart className="h-4 w-4" />,
        'Comments':        <MessageCircle className="h-4 w-4" />,
        'Shares':          <Share2 className="h-4 w-4" />,
      }
      const colorMap: Record<string, string> = {
        'Engagement Rate': 'oklch(0.68 0.25 260 / 0.12)',
        'Watch Time':      'oklch(0.72 0.18 210 / 0.12)',
        'Caption Length':  'oklch(0.72 0.18 60 / 0.12)',
        'Hashtags':        'oklch(0.72 0.19 150 / 0.12)',
        'Likes':           'oklch(0.65 0.22 25 / 0.12)',
        'Comments':        'oklch(0.78 0.17 65 / 0.12)',
        'Shares':          'oklch(0.72 0.18 200 / 0.12)',
        'Posting Time':    'oklch(0.72 0.18 280 / 0.12)',
      }
      cards.push({
        icon: iconMap[row.factor] || <Brain className="h-4 w-4" />,
        title: `Improve ${row.factor}`,
        body: row.recommendation,
        color: colorMap[row.factor] || 'oklch(0.68 0.25 260 / 0.12)',
      })
    }
  })

  // Cap at 4 cards
  return cards.slice(0, 4)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ViralPredictor() {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scores, setScores] = useState<ViralityScores | null>(null)

  const handleAnalyze = async () => {
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setScores(null)

    const features = extractFeatures(input)
    const factorRows = buildFactorRows(features)

    console.log('ViralAI ML INPUT:', features)

    try {
      const res = await fetch('/api/virality-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Prediction failed')
      }

      const score = Math.round(Number(data.predictedScore) || 0)

      setScores({
        overall: score,
        model: data.model || 'Linear Regression',
        topFactors: data.topFactors || [],
        factorRows,
        format: platform === 'YouTube' ? 'Video' : 'Reel',
        engagement:
          score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low',
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="vi-card h-full flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="rounded-lg p-1.5"
              style={{ background: 'oklch(0.68 0.25 260 / 0.12)' }}
            >
              <Brain className="h-4 w-4" style={{ color: 'oklch(0.68 0.25 260)' }} />
            </div>
            <h2 className="text-lg font-bold">AI Viral Score</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Predict your content&apos;s viral potential using machine learning.
          </p>
        </div>
        {scores && (
          <button
            onClick={() => { setScores(null); setInput('') }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {!scores ? (
        /* ── Input State ── */
        <div className="flex flex-col gap-4 flex-1">
          {/* Textarea */}
          <div>
            <label className="text-sm font-medium block mb-2">
              What are you planning to post?
            </label>
            <Textarea
              id="viral-predictor-input"
              placeholder="Describe your post, caption, video idea or content concept..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-28 resize-none text-sm bg-muted border-border/60 focus:border-primary/50 rounded-xl"
            />
            <p className="text-[11px] text-muted-foreground mt-1.5 text-right">
              {input.length} characters
            </p>
          </div>

          {/* Platform selector */}
          <div>
            <label className="text-sm font-medium block mb-2">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  id={`platform-${p.id.toLowerCase()}`}
                  onClick={() => setPlatform(p.id)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border"
                  style={
                    platform === p.id
                      ? {
                          background: `${p.color}20`,
                          borderColor: `${p.color}60`,
                          color: p.color,
                        }
                      : {
                          background: 'transparent',
                          borderColor: 'var(--border)',
                          color: 'var(--muted-foreground)',
                        }
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl text-sm"
              style={{
                background: 'oklch(0.65 0.22 25 / 0.1)',
                border: '1px solid oklch(0.65 0.22 25 / 0.25)',
                color: 'oklch(0.65 0.22 25)',
              }}
            >
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to analyze content</p>
                <p className="text-xs mt-0.5 opacity-80">
                  Please check that the ML service is running and try again.
                </p>
                <button
                  onClick={handleAnalyze}
                  className="flex items-center gap-1 mt-1.5 text-xs font-semibold underline underline-offset-2 hover:no-underline"
                >
                  <RefreshCw className="h-3 w-3" /> Retry
                </button>
              </div>
            </div>
          )}

          {/* Analyze button */}
          <button
            id="viral-predictor-analyze-btn"
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="btn-gradient w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold mt-auto"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing content...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Viral Potential
              </>
            )}
          </button>
        </div>

      ) : (
        /* ── Results State ── */
        <div className="space-y-5 animate-fade-in">

          {/* ── Score Display ── */}
          <div
            className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5"
            style={{
              background: 'oklch(0.15 0.03 280)',
              border: '1px solid oklch(0.25 0.04 280)',
            }}
          >
            {/* Ring */}
            <div className="flex-shrink-0">
              <ScoreRing score={scores.overall} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              {(() => {
                const info = getScoreExplanation(scores.overall)
                return (
                  <>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <span
                        className="text-sm font-bold px-3 py-1 rounded-full"
                        style={{ background: `${info.color}18`, color: info.color, border: `1px solid ${info.color}40` }}
                      >
                        {info.tier}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-1">What does this score mean?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {info.explanation}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-muted-foreground">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                        style={{
                          background: 'oklch(0.68 0.25 260 / 0.12)',
                          color: 'oklch(0.68 0.25 260)',
                        }}
                      >
                        {scores.model}
                      </span>
                      <span>Format: {scores.format}</span>
                      <span>Platform: {platform}</span>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          {/* ── Top Influencing Factors (from ML API) ── */}
          {scores.topFactors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold">Top Influencing Factors</p>
                <span className="text-[11px] text-muted-foreground">From ML model coefficients</span>
              </div>

              {/* Progress-style bars */}
              <div className="space-y-3">
                {scores.topFactors.map((factor, i) => {
                  const label = FEATURE_LABELS[factor.feature] || factor.feature
                  const icon = FEATURE_ICONS[factor.feature]
                  const isPos = factor.influence > 0
                  const maxInfluence = Math.max(...scores.topFactors.map(f => Math.abs(f.influence)))
                  const barWidth = Math.round((Math.abs(factor.influence) / maxInfluence) * 100)
                  const barColor = isPos ? 'oklch(0.68 0.25 260)' : 'oklch(0.65 0.22 25)'

                  return (
                    <div key={i} className="space-y-1.5" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span style={{ color: barColor }}>{icon}</span>
                          <span className="font-medium">{label}</span>
                          <span className="text-muted-foreground text-[10px]">
                            coef: {factor.coefficient}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isPos ? (
                            <TrendingUp className="h-3 w-3" style={{ color: barColor }} />
                          ) : factor.influence === 0 ? (
                            <Minus className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <TrendingDown className="h-3 w-3" style={{ color: barColor }} />
                          )}
                          <span className="font-bold" style={{ color: barColor }}>
                            {isPos ? '+' : ''}{factor.influence}
                          </span>
                        </div>
                      </div>
                      {/* Bar */}
                      <div
                        className="h-1.5 rounded-full"
                        style={{ background: 'oklch(0.22 0.02 280)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${barWidth}%`,
                            background: `linear-gradient(90deg, ${barColor}, ${barColor}99)`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Improvement Projection ── */}
          <div
            className="rounded-xl p-4 flex items-center justify-between gap-4"
            style={{
              background: 'oklch(0.68 0.25 260 / 0.06)',
              border: '1px solid oklch(0.68 0.25 260 / 0.2)',
            }}
          >
            <div>
              <p className="text-xs font-semibold mb-1 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" style={{ color: 'oklch(0.68 0.25 260)' }} />
                Potential Improvement
              </p>
              <p className="text-[11px] text-muted-foreground">
                Recommended target (not guaranteed):
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold" style={{ color: 'oklch(0.68 0.25 260)' }}>
                {scores.overall} → {Math.min(100, scores.overall + 15)}–{Math.min(100, scores.overall + 20)}
              </p>
              <p className="text-[11px] text-muted-foreground">+15–20 potential points</p>
            </div>
          </div>

          {/* ── How to Increase Score table ── */}
          <div>
            <p className="text-sm font-bold mb-3">How to Increase Your Virality Score</p>
            <div className="rounded-xl overflow-x-auto border border-border/50">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr style={{ background: 'oklch(0.16 0.02 280)' }}>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Factor</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Current</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.factorRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-3 py-2.5 font-semibold whitespace-nowrap">{row.factor}</td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{row.current}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground leading-relaxed">{row.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── AI Recommendation Cards ── */}
          {(() => {
            const recCards = buildRecommendationCards(scores.factorRows)
            if (recCards.length === 0) return null
            return (
              <div>
                <p className="text-sm font-bold mb-3">AI Recommendations</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {recCards.map((card, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3.5 flex gap-3"
                      style={{
                        background: card.color,
                        border: '1px solid oklch(0.28 0.04 280)',
                      }}
                    >
                      <div
                        className="flex-shrink-0 rounded-lg p-1.5 mt-0.5"
                        style={{
                          background: 'oklch(0.68 0.25 260 / 0.15)',
                          color: 'oklch(0.78 0.2 260)',
                        }}
                      >
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1">{card.title}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{card.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Reset */}
          <Button
            onClick={() => { setScores(null); setInput('') }}
            variant="outline"
            className="w-full rounded-xl h-10"
            id="viral-predictor-reset-btn"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Analyze Another Post
          </Button>

        </div>
      )}
    </div>
  )
}
