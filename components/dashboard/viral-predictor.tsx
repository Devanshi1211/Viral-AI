'use client'

import { useState } from 'react'
import { Sparkles, Send, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

interface ViralityScores {
  overall: number
  hook: number
  emotional: number
  retention: number
  shareability: number
  trend: number
  suggestions: string[]
  format: string
  engagement: string
}

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

    try {
      const res = await fetch('/api/virality-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: input, platform }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      const text = data.text || ''

      // Parse scores from AI response
      const parsed = parseViralityScores(text)
      setScores(parsed)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function parseViralityScores(text: string): ViralityScores {
    const extractScore = (label: string): number => {
      const patterns = [
        new RegExp(`${label}[^\\d]*(\\d{1,3})\\s*/\\s*100`, 'i'),
        new RegExp(`${label}[^\\d]*(\\d{1,3})`, 'i'),
      ]
      for (const pattern of patterns) {
        const match = text.match(pattern)
        if (match) {
          const num = parseInt(match[1])
          return num > 100 ? 100 : num
        }
      }
      return Math.floor(Math.random() * 30 + 50) // fallback
    }

    // Extract suggestions
    const suggestions: string[] = []
    const suggestionBlock = text.match(/suggestions?[\s\S]*?(?=best content|predicted|format|$)/i)
    if (suggestionBlock) {
      const lines = suggestionBlock[0].split('\n')
      for (const line of lines) {
        const cleaned = line.replace(/^[\d\.\-\*•]+\s*/, '').trim()
        if (cleaned.length > 10 && !cleaned.toLowerCase().startsWith('suggestion')) {
          suggestions.push(cleaned)
        }
      }
    }

    // Extract format
    const formatMatch = text.match(/best (?:content )?format[^:]*:\s*(.+)/i)
    const format = formatMatch ? formatMatch[1].trim() : 'Reel'

    // Extract engagement level
    const engagementMatch = text.match(/(?:predicted )?engagement[^:]*:\s*(.+)/i)
    const engagement = engagementMatch ? engagementMatch[1].trim() : 'Medium'

    return {
      overall: extractScore('(?:overall )?viral'),
      hook: extractScore('hook'),
      emotional: extractScore('emotional'),
      retention: extractScore('retention'),
      shareability: extractScore('shareab'),
      trend: extractScore('trend'),
      suggestions: suggestions.slice(0, 3),
      format,
      engagement,
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="glass-card lg:col-span-2">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold mb-2">Viral Prediction Panel</h2>
          <p className="text-sm text-muted-foreground">
            Get AI-powered insights on your content&apos;s viral potential
          </p>
        </div>

        {!scores ? (
          <>
            {/* Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Enter your content idea</label>
              <Textarea
                placeholder="Share your post idea, caption, video topic, or content concept..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-24 bg-muted resize-none"
              />

              <div>
                <label className="text-sm font-medium block mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-muted border border-border/50 text-sm"
                >
                  <option>Instagram</option>
                  <option>YouTube</option>
                  <option>Twitter</option>
                  <option>TikTok</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded">{error}</p>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Content
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            {/* Overall Viral Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">Viral Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(scores.overall)}`}>
                  {scores.overall}/100
                </span>
              </div>
              <Progress value={scores.overall} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {scores.engagement}
                </p>
                <p className="text-xs text-muted-foreground">
                  Best format: {scores.format}
                </p>
              </div>
            </div>

            {/* Detailed Scores */}
            <div>
              <p className="font-semibold mb-3">Detailed Analysis</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '🎣 Hook', value: scores.hook },
                  { label: '❤️ Emotion', value: scores.emotional },
                  { label: '⏳ Retention', value: scores.retention },
                  { label: '🔄 Shareability', value: scores.shareability },
                  { label: '📈 Trend Fit', value: scores.trend },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${getScoreColor(item.value)}`}>
                        {item.value}/100
                      </span>
                      <Progress value={item.value} className="h-1 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            {scores.suggestions.length > 0 && (
              <div>
                <p className="font-semibold mb-3">AI Suggestions</p>
                <ul className="space-y-2">
                  {scores.suggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary">→</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reset Button */}
            <Button
              onClick={() => {
                setScores(null)
                setInput('')
              }}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Analyze Another
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
