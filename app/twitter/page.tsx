'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Sparkles, Loader2, Check, Hash, TrendingUp } from 'lucide-react'

interface HashtagData {
  twitter?: {
    trending?: string[]
    viral?: string[]
    conversation?: string[]
    niche?: string[]
  }
  top_viral_overall?: string[]
}

export default function TwitterPage() {
  const [activeTab, setActiveTab] = useState('posts')

  // Posts generation
  const [idea, setIdea] = useState('')
  const [style, setStyle] = useState('informative')
  const [generatedTweets, setGeneratedTweets] = useState('')
  const [loading, setLoading] = useState(false)

  // Hashtags
  const [hashtagIdea, setHashtagIdea] = useState('')
  const [hashtagData, setHashtagData] = useState<HashtagData | null>(null)
  const [loadingHashtags, setLoadingHashtags] = useState(false)

  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!idea.trim()) return
    setError('')
    setGeneratedTweets('')

    setLoading(true)
    try {
      const res = await fetch('/api/twitter/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: idea, style }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Tweet generation failed')
      setGeneratedTweets(data.text)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Tweet generation failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateHashtags = async () => {
    if (!hashtagIdea.trim()) return
    setError('')
    setLoadingHashtags(true)

    try {
      const res = await fetch('/api/twitter/viral-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: hashtagIdea,
          audience: 'general',
          contentType: 'tweet',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Hashtag generation failed')
      setHashtagData(data.data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hashtag generation failed'
      setError(msg)
    } finally {
      setLoadingHashtags(false)
    }
  }

  const handleCopy = (text: string, index: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyCategory = (tags: string[], key: string) => {
    handleCopy(tags.join(' '), key)
  }

  const tweetList = generatedTweets
    .split('\n\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)

  const renderHashtagCategory = (
    tags: string[] | undefined,
    label: string,
    icon: React.ReactNode,
    colorClass: string,
    copyKey: string
  ) => {
    if (!tags || tags.length === 0) return null
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tags.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopyCategory(tags, copyKey)}
          >
            {copiedIndex === copyKey ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span className="ml-1 text-xs">Copy All</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <button
              key={`${copyKey}-${i}`}
              onClick={() => handleCopy(tag, `${copyKey}-${i}`)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${colorClass} ${
                copiedIndex === `${copyKey}-${i}` ? 'ring-2 ring-green-400' : ''
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />

      <main className="ml-64 mt-16 p-6">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">X (Twitter) Content Creator</h1>
            <p className="text-muted-foreground mt-2">
              Generate viral tweets and discover trending hashtags for maximum reach
            </p>
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="posts">
                <Sparkles className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="hashtags">
                <Hash className="h-4 w-4 mr-2" />
                Hashtags
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6 mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Section */}
                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Tweet Generator</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tweet Idea / Topic</label>
                      <Textarea
                        placeholder="What do you want to tweet about? Share your idea, news, or thoughts..."
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        className="min-h-32 bg-muted resize-none mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Tweet Style</label>
                      <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full h-10 mt-2 px-3 rounded-lg bg-muted border border-border/50"
                      >
                        <option value="informative">Informative</option>
                        <option value="humorous">Humorous</option>
                        <option value="thought-provoking">Thought-Provoking</option>
                        <option value="promotional">Promotional</option>
                        <option value="conversational">Conversational</option>
                      </select>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={loading || !idea.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Tweets
                        </>
                      )}
                    </Button>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        ❌ {error}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Tweet Preview</h2>
                  <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 flex items-center justify-center border-2 border-dashed border-border/50 min-h-32">
                    <div className="text-center">
                      {loading ? (
                        <>
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-500" />
                          <p className="text-sm text-muted-foreground">Generating your tweet...</p>
                        </>
                      ) : tweetList.length > 0 ? (
                        <>
                          <p className="text-4xl mb-3">✨</p>
                          <p className="text-sm text-left leading-relaxed max-w-xs">
                            {tweetList[0]}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-4xl mb-2">💬</p>
                          <p className="text-sm text-muted-foreground">
                            Your tweet preview will appear here
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Tweets */}
              {tweetList.length > 0 && (
                <div className="glass-card">
                  <h2 className="text-lg font-bold mb-4">Generated Tweets</h2>
                  <div className="space-y-3">
                    {tweetList.map((text, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-muted/30 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-2">
                            {text.length}/280 characters
                          </p>
                          <p className="text-sm leading-relaxed">{text}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(text, `tweet-${i}`)}
                        >
                          {copiedIndex === `tweet-${i}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Hashtags Tab */}
            <TabsContent value="hashtags" className="space-y-6 mt-6">
              <div className="glass-card">
                <h2 className="text-xl font-bold mb-4">Viral Hashtag Generator</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate trending and viral hashtags optimized for maximum reach and engagement
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Topic / Hashtag Idea</label>
                    <Textarea
                      placeholder="What's your tweet about? (e.g., 'Python programming tips', 'Startups in 2024')"
                      value={hashtagIdea}
                      onChange={(e) => setHashtagIdea(e.target.value)}
                      className="min-h-24 bg-muted resize-none mt-2"
                    />
                  </div>

                  <Button
                    onClick={handleGenerateHashtags}
                    disabled={loadingHashtags || !hashtagIdea.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                  >
                    {loadingHashtags ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate Hashtags
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Hashtag Results */}
              {hashtagData?.twitter && (
                <div className="glass-card space-y-6">
                  <h2 className="text-lg font-bold">Trending & Viral Hashtags</h2>

                  {renderHashtagCategory(
                    hashtagData.twitter.trending,
                    'Trending Now',
                    <TrendingUp className="h-4 w-4 text-blue-400" />,
                    'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25',
                    'tw-trending'
                  )}

                  {renderHashtagCategory(
                    hashtagData.twitter.viral,
                    'Viral',
                    <Sparkles className="h-4 w-4 text-cyan-400" />,
                    'bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25',
                    'tw-viral'
                  )}

                  {renderHashtagCategory(
                    hashtagData.twitter.conversation,
                    'Conversation',
                    <Hash className="h-4 w-4 text-sky-400" />,
                    'bg-sky-500/15 text-sky-400 hover:bg-sky-500/25',
                    'tw-convo'
                  )}

                  {renderHashtagCategory(
                    hashtagData.twitter.niche,
                    'Niche / Community',
                    <TrendingUp className="h-4 w-4 text-indigo-400" />,
                    'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25',
                    'tw-niche'
                  )}

                  {hashtagData.top_viral_overall && (
                    <>
                      <div className="border-t border-border/50 pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-semibold">Top 10 Most Viral</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {hashtagData.top_viral_overall.map((tag, i) => (
                            <button
                              key={i}
                              onClick={() => handleCopy(tag, `top-${i}`)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-500/25 text-yellow-400 hover:bg-yellow-500/35 transition-all ${
                                copiedIndex === `top-${i}` ? 'ring-2 ring-yellow-400' : ''
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const all = [
                        ...(hashtagData.twitter?.trending || []),
                        ...(hashtagData.twitter?.viral || []),
                        ...(hashtagData.twitter?.conversation || []),
                        ...(hashtagData.twitter?.niche || []),
                      ]
                      handleCopy(all.join(' '), 'tw-all')
                    }}
                  >
                    {copiedIndex === 'tw-all' ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-400" />
                        Copied All!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy All Hashtags
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Error Message */}
          {error && !activeTab.includes('posts') && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ❌ {error}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
