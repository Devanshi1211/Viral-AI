'use client'

import { useState, useRef } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Sparkles, Loader2, Check, Upload, Hash, Wand2, TrendingUp, X, ImageIcon } from 'lucide-react'

interface HashtagData {
  instagram?: Record<string, string[]>
  youtube?: {
    seo_keywords?: string[]
    video_tags?: string[]
    long_tail_keywords?: string[]
    shorts_tags?: string[]
  }
  twitter?: Record<string, string[]>
  top_viral_overall?: string[]
  scores?: Record<string, number>
}

export default function YouTubePage() {
  const [activeTab, setActiveTab] = useState('generate')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate tab
  const [topic, setTopic] = useState('')
  const [generatedTitles, setGeneratedTitles] = useState('')
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [loadingTitles, setLoadingTitles] = useState(false)
  const [loadingDescription, setLoadingDescription] = useState(false)

  // Thumbnail tab
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [thumbnailTitle, setThumbnailTitle] = useState('')
  const [loadingThumbnailAnalysis, setLoadingThumbnailAnalysis] = useState(false)
  const [thumbnailSuggestions, setThumbnailSuggestions] = useState<string | null>(null)

  // Hashtags tab
  const [hashtagTopic, setHashtagTopic] = useState('')
  const [hashtagData, setHashtagData] = useState<HashtagData | null>(null)
  const [loadingHashtags, setLoadingHashtags] = useState(false)

  const [error, setError] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Handle generate (existing)
  const handleGenerate = async () => {
    if (!topic.trim()) return
    setError('')
    setGeneratedTitles('')
    setGeneratedDescription('')

    // Generate titles
    setLoadingTitles(true)
    try {
      const res = await fetch('/api/youtube/titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Title generation failed')
      setGeneratedTitles(data.text)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Title generation failed'
      setError(message)
    } finally {
      setLoadingTitles(false)
    }

    // Generate description
    setLoadingDescription(true)
    try {
      const res = await fetch('/api/youtube/descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, title: topic }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Description generation failed')
      setGeneratedDescription(data.text)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Description generation failed'
      if (!error) setError(message)
    } finally {
      setLoadingDescription(false)
    }
  }

  // Thumbnail handlers
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setThumbnailFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setThumbnailPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyzeThumbnail = async () => {
    if (!thumbnailTitle.trim()) {
      setError('Please enter your video title')
      return
    }

    setError('')
    setLoadingThumbnailAnalysis(true)

    try {
      const res = await fetch('/api/youtube/thumbnail-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: thumbnailTitle,
          description: generatedDescription,
          niche: 'general',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setThumbnailSuggestions(data.suggestions)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed'
      setError(msg)
    } finally {
      setLoadingThumbnailAnalysis(false)
    }
  }

  // Hashtag handler
  const handleGenerateHashtags = async () => {
    if (!hashtagTopic.trim()) return

    setError('')
    setLoadingHashtags(true)

    try {
      const res = await fetch('/api/youtube/viral-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: hashtagTopic,
          audience: 'general',
          contentType: 'video',
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

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleCopyCategory = (tags: string[], key: string) => {
    handleCopy(tags.join(' '), key)
  }

  const titleList = generatedTitles
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

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
            {copiedKey === copyKey ? (
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
                copiedKey === `${copyKey}-${i}` ? 'ring-2 ring-green-400' : ''
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
            <h1 className="text-3xl font-bold">YouTube Content Optimizer</h1>
            <p className="text-muted-foreground mt-2">
              Generate titles, descriptions, analyze thumbnails, and discover viral tags
            </p>
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="generate">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="thumbnail">
                <ImageIcon className="h-4 w-4 mr-2" />
                Thumbnail
              </TabsTrigger>
              <TabsTrigger value="hashtags">
                <Hash className="h-4 w-4 mr-2" />
                Hashtags
              </TabsTrigger>
            </TabsList>

            {/* Generate Tab */}
            <TabsContent value="generate" className="space-y-6 mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Section */}
                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Video Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Video Topic / Concept</label>
                      <Textarea
                        placeholder="Describe your video topic, key points, and target audience..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="min-h-32 bg-muted resize-none mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <select className="w-full h-10 mt-2 px-3 rounded-lg bg-muted border border-border/50">
                          <option>Technology</option>
                          <option>Entertainment</option>
                          <option>Education</option>
                          <option>Business</option>
                          <option>Lifestyle</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration</label>
                        <select className="w-full h-10 mt-2 px-3 rounded-lg bg-muted border border-border/50">
                          <option>Under 10 min</option>
                          <option>10-20 min</option>
                          <option>20-30 min</option>
                          <option>30+ min</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={loadingTitles || loadingDescription || !topic.trim()}
                      className="w-full h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 disabled:opacity-50"
                    >
                      {loadingTitles || loadingDescription ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Content
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
                <div className="space-y-6">
                  {/* Titles Preview */}
                  <div className="glass-card">
                    <h2 className="text-lg font-bold mb-3">🎯 Title Preview</h2>
                    {loadingTitles ? (
                      <div className="flex items-center gap-3 p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">Generating...</p>
                      </div>
                    ) : titleList.length > 0 ? (
                      <p className="text-sm p-3 rounded bg-muted/30 line-clamp-3">
                        {titleList[0]}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Titles will appear here</p>
                    )}
                  </div>

                  {/* Description Preview */}
                  <div className="glass-card">
                    <h2 className="text-lg font-bold mb-3">📝 Description Preview</h2>
                    {loadingDescription ? (
                      <div className="flex items-center gap-3 p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">Generating...</p>
                      </div>
                    ) : generatedDescription ? (
                      <p className="text-sm p-3 rounded bg-muted/30 whitespace-pre-wrap line-clamp-3">
                        {generatedDescription}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Description will appear here</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Results */}
              {(titleList.length > 0 || generatedDescription) && (
                <div className="glass-card space-y-6">
                  <h2 className="text-lg font-bold">Generated Content</h2>

                  {titleList.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">Video Titles</h3>
                      {titleList.map((title, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-lg bg-muted/30 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
                        >
                          <p className="text-sm flex-1">{title}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(title, `title-${i}`)}
                          >
                            {copiedKey === `title-${i}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {generatedDescription && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">Video Description</h3>
                      <div className="p-4 rounded-lg bg-muted/30">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {generatedDescription}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => handleCopy(generatedDescription, 'desc')}
                        >
                          {copiedKey === 'desc' ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Description
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Thumbnail Tab */}
            <TabsContent value="thumbnail" className="space-y-6 mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Upload Section */}
                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Upload Thumbnail</h2>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center cursor-pointer hover:border-red-500/50 transition-colors mb-4"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    {thumbnailFile ? (
                      <div className="space-y-2">
                        <ImageIcon className="h-8 w-8 mx-auto text-red-500" />
                        <p className="text-sm font-medium">{thumbnailFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload thumbnail</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG - Max 50MB</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Video Title</label>
                      <input
                        type="text"
                        placeholder="Enter your video title..."
                        value={thumbnailTitle}
                        onChange={(e) => setThumbnailTitle(e.target.value)}
                        className="w-full h-10 mt-2 px-3 rounded-lg bg-muted border border-border/50"
                      />
                    </div>

                    <Button
                      onClick={handleAnalyzeThumbnail}
                      disabled={loadingThumbnailAnalysis || !thumbnailTitle.trim()}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
                    >
                      {loadingThumbnailAnalysis ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Get Suggestions
                        </>
                      )}
                    </Button>

                    {thumbnailFile && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setThumbnailFile(null)
                          setThumbnailPreview(null)
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Thumbnail Preview</h2>
                  <div className="rounded-xl bg-muted overflow-hidden aspect-video flex items-center justify-center">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">No thumbnail uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {thumbnailSuggestions && (
                <div className="glass-card">
                  <h2 className="text-lg font-bold mb-4">🎬 Thumbnail Suggestions</h2>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {thumbnailSuggestions}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => handleCopy(thumbnailSuggestions, 'thumb-suggestions')}
                  >
                    {copiedKey === 'thumb-suggestions' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Suggestions
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Hashtags Tab */}
            <TabsContent value="hashtags" className="space-y-6 mt-6">
              <div className="glass-card">
                <h2 className="text-xl font-bold mb-4">Viral Tags & Keywords</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate platform-optimized viral hashtags and keywords for your video
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Video Topic</label>
                    <Textarea
                      placeholder="What's your video about? (e.g., 'Best programming tutorials', 'Gaming highlights')"
                      value={hashtagTopic}
                      onChange={(e) => setHashtagTopic(e.target.value)}
                      className="min-h-24 bg-muted resize-none mt-2"
                    />
                  </div>

                  <Button
                    onClick={handleGenerateHashtags}
                    disabled={loadingHashtags || !hashtagTopic.trim()}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
                  >
                    {loadingHashtags ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Results */}
              {hashtagData?.youtube && (
                <div className="glass-card space-y-6">
                  <h2 className="text-lg font-bold">YouTube Tags & Keywords</h2>

                  {renderHashtagCategory(
                    hashtagData.youtube.seo_keywords,
                    'SEO Keywords',
                    <TrendingUp className="h-4 w-4 text-red-400" />,
                    'bg-red-500/15 text-red-400 hover:bg-red-500/25',
                    'yt-seo'
                  )}

                  {renderHashtagCategory(
                    hashtagData.youtube.video_tags,
                    'Video Tags',
                    <Hash className="h-4 w-4 text-orange-400" />,
                    'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25',
                    'yt-tags'
                  )}

                  {renderHashtagCategory(
                    hashtagData.youtube.long_tail_keywords,
                    'Long-Tail Keywords',
                    <Sparkles className="h-4 w-4 text-amber-400" />,
                    'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25',
                    'yt-longtail'
                  )}

                  {renderHashtagCategory(
                    hashtagData.youtube.shorts_tags,
                    'YouTube Shorts Tags',
                    <TrendingUp className="h-4 w-4 text-yellow-400" />,
                    'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25',
                    'yt-shorts'
                  )}

                  {hashtagData.top_viral_overall && (
                    <>
                      <div className="border-t border-border/50 pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-red-400" />
                          <span className="text-sm font-semibold">Top 10 Most Viral</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {hashtagData.top_viral_overall.map((tag, i) => (
                            <button
                              key={i}
                              onClick={() => handleCopy(tag, `top-${i}`)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/25 text-red-400 hover:bg-red-500/35 transition-all ${
                                copiedKey === `top-${i}` ? 'ring-2 ring-red-400' : ''
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ❌ {error}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
