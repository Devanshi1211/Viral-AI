'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, RefreshCw, Sparkles, Loader2, Check, AlertCircle } from 'lucide-react'

export default function GeneratorPage() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [platform, setPlatform] = useState('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<{
    hooks: string[]
    headlines: string[]
    ctas: string[]
    captions: string[]
  } | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setResults(null)

    try {
      // Build a comprehensive prompt for all content types
      const prompt = `You are a world-class social media content strategist.

Generate content for this topic: "${topic}"
Tone: ${tone}
Platform: ${platform}

Return EXACTLY in this format with clear sections:

HOOKS:
1. [hook 1]
2. [hook 2]
3. [hook 3]
4. [hook 4]
5. [hook 5]

HEADLINES:
1. [headline 1]
2. [headline 2]
3. [headline 3]
4. [headline 4]
5. [headline 5]

CTAS:
1. [cta 1]
2. [cta 2]
3. [cta 3]
4. [cta 4]
5. [cta 5]

CAPTIONS:
CAPTION 1:
[full caption with hook, value, CTA, and relevant hashtags]

CAPTION 2:
[full caption with hook, value, CTA, and relevant hashtags]

CAPTION 3:
[full caption with hook, value, CTA, and relevant hashtags]

Rules:
- Hooks: attention-grabbing first lines, under 15 words each
- Headlines: compelling titles with emojis, numbers, or power words
- CTAs: engagement-driving calls-to-action
- Captions: full ready-to-post captions with hashtags`

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      const text = data.text || ''

      // Parse the response into sections
      const hooks = parseSection(text, 'HOOKS', 'HEADLINES')
      const headlines = parseSection(text, 'HEADLINES', 'CTAS')
      const ctas = parseSection(text, 'CTAS', 'CAPTIONS')
      const captions = parseCaptions(text)

      setResults({
        hooks: hooks.length > 0 ? hooks : ['No hooks generated'],
        headlines: headlines.length > 0 ? headlines : ['No headlines generated'],
        ctas: ctas.length > 0 ? ctas : ['No CTAs generated'],
        captions: captions.length > 0 ? captions : ['No captions generated'],
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function parseSection(text: string, startKey: string, endKey: string): string[] {
    const startIdx = text.indexOf(startKey)
    const endIdx = text.indexOf(endKey)
    if (startIdx === -1) return []
    
    const section = endIdx > startIdx
      ? text.substring(startIdx + startKey.length + 1, endIdx)
      : text.substring(startIdx + startKey.length + 1)

    return section
      .split('\n')
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').replace(/^\*+\s*/, '').trim())
      .filter((line) => line.length > 3)
      .slice(0, 5)
  }

  function parseCaptions(text: string): string[] {
    const captionIdx = text.indexOf('CAPTIONS')
    if (captionIdx === -1) {
      // Fallback: try to get last chunk of text
      const lines = text.split('\n').filter(l => l.trim().length > 20)
      return lines.slice(-3)
    }

    const captionText = text.substring(captionIdx + 9)
    const captions: string[] = []
    const blocks = captionText.split(/CAPTION \d+:/i).filter(b => b.trim().length > 10)
    
    for (const block of blocks.slice(0, 3)) {
      captions.push(block.trim())
    }

    if (captions.length === 0) {
      // Fallback: split by double newlines
      return captionText.split(/\n\n+/).filter(b => b.trim().length > 20).slice(0, 3)
    }

    return captions
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(key)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />

      <main className="ml-64 mt-16 p-6">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Content Generator</h1>
            <p className="text-muted-foreground mt-2">
              Generate hooks, headlines, CTAs, and captions with AI
            </p>
          </div>

          {/* Input Section */}
          <div className="glass-card">
            <h2 className="text-xl font-bold mb-6">Content Configuration</h2>

            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Content Topic / Idea
                </label>
                <Textarea
                  placeholder="Describe your content topic, product, or idea..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-24 bg-muted resize-none"
                />
              </div>

              {/* Configuration Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="viral">Viral</option>
                    <option value="educational">Educational</option>
                    <option value="humorous">Humorous</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Primary Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50"
                  >
                    <option value="general">General/Multi-Platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Target Audience
                  </label>
                  <select className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50">
                    <option>Tech Professionals</option>
                    <option>Entrepreneurs</option>
                    <option>Students</option>
                    <option>Content Creators</option>
                    <option>General Audience</option>
                  </select>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content Ideas
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Generated Content */}
          {results && (
            <div className="glass-card">
              <Tabs defaultValue="hooks" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="hooks">Hooks</TabsTrigger>
                  <TabsTrigger value="headlines">Headlines</TabsTrigger>
                  <TabsTrigger value="ctas">CTAs</TabsTrigger>
                  <TabsTrigger value="captions">Captions</TabsTrigger>
                </TabsList>

                {/* Hooks */}
                <TabsContent value="hooks" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Attention-grabbing hooks to start your content:
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={loading}>
                      <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>

                  {results.hooks.map((hook, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-muted/30 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors group"
                    >
                      <p className="text-sm font-medium flex-1">{hook}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(hook, `hook-${i}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        {copiedIndex === `hook-${i}` ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                {/* Headlines */}
                <TabsContent value="headlines" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Compelling headlines for your posts:
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={loading}>
                      <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>

                  {results.headlines.map((headline, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-muted/30 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors group"
                    >
                      <p className="text-sm font-medium flex-1">{headline}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(headline, `headline-${i}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        {copiedIndex === `headline-${i}` ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                {/* CTAs */}
                <TabsContent value="ctas" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Call-to-action prompts to drive engagement:
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={loading}>
                      <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>

                  {results.ctas.map((cta, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-muted/30 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors group"
                    >
                      <p className="text-sm flex-1">{cta}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(cta, `cta-${i}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        {copiedIndex === `cta-${i}` ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                {/* Captions */}
                <TabsContent value="captions" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Full captions ready to post:
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={loading}>
                      <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                  </div>

                  {results.captions.map((caption, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <p className="text-xs font-semibold text-primary">
                          Option {i + 1}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(caption, `caption-${i}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedIndex === `caption-${i}` ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {caption}
                      </p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
