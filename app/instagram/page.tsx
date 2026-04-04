'use client'

import { useState, useRef, type ReactNode } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Sparkles, Loader2, Check, Upload, ImageIcon, Film, Hash, TrendingUp, Target, Zap } from 'lucide-react'

interface HashtagData {
  instagram?: {
    viral_high_competition?: string[]
    medium_competition?: string[]
    low_competition_niche?: string[]
    long_tail?: string[]
  }
  youtube?: {
    seo_keywords?: string[]
    video_tags?: string[]
    long_tail_keywords?: string[]
    shorts_tags?: string[]
  }
  twitter?: {
    trending?: string[]
    viral?: string[]
    conversation?: string[]
    niche?: string[]
  }
  top_viral_overall?: string[]
  scores?: Record<string, number>
}

export default function InstagramPage() {
  const [activeTab, setActiveTab] = useState('generate')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('engaging')
  const [niche, setNiche] = useState('general')
  const [audience, setAudience] = useState('general')
  const [contentType, setContentType] = useState('post')
  const [generatedCaptions, setGeneratedCaptions] = useState('')
  const [loadingCaptions, setLoadingCaptions] = useState(false)

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaDescription, setMediaDescription] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [mediaSuggestions, setMediaSuggestions] = useState<string | null>(null)

  const [hashtagData, setHashtagData] = useState<HashtagData | null>(null)
  const [loadingHashtags, setLoadingHashtags] = useState(false)

  const [error, setError] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleGenerateCaptions = async () => {
    if (!topic.trim()) return
    setError('')
    setGeneratedCaptions('')

    setLoadingCaptions(true)
    try {
      const res = await fetch('/api/instagram/captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Caption generation failed')
      setGeneratedCaptions(data.text)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Caption generation failed'
      setError(msg)
    } finally {
      setLoadingCaptions(false)
    }
  }

  const handleGenerateHashtags = async () => {
    if (!topic.trim()) return
    setError('')
    setLoadingHashtags(true)
    setHashtagData(null)

    try {
      const res = await fetch('/api/instagram/viral-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, audience, contentType }),
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(file)
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image')

    const reader = new FileReader()
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyzeMedia = async () => {
    if (!mediaDescription.trim()) {
      setError('Please describe your post or reel content')
      return
    }

    setError('')
    setMediaSuggestions(null)
    setLoadingAnalysis(true)

    try {
      const res = await fetch('/api/instagram/media-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: mediaDescription,
          contentType,
          mediaType,
          niche,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Media analysis failed')
      setMediaSuggestions(data.suggestions)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Media analysis failed'
      setError(msg)
    } finally {
      setLoadingAnalysis(false)
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

  const captionList = generatedCaptions
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const renderHashtagCategory = (
    tags: string[] | undefined,
    label: string,
    icon: ReactNode,
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
          <Button variant="ghost" size="sm" onClick={() => handleCopyCategory(tags, copyKey)}>
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
          <div>
            <h1 className="text-3xl font-bold">Instagram Content Optimizer</h1>
            <p className="text-muted-foreground mt-2">
              Generate captions, upload media for analysis, and get viral hashtag suggestions.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6 mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Caption Generator</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Post Idea</label>
                      <Textarea
                        placeholder="Describe your Instagram post, reel, or caption idea..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="min-h-32 bg-muted resize-none mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-sm font-medium">
                        Tone
                        <select
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          className="w-full h-10 mt-2 px-3 rounded-lg bg-muted border border-border/50"
                        >
                          <option value="engaging">Engaging</option>
                          <option value="fun">Fun</option>
                          <option value="professional">Professional</option>
                          <option value="inspirational">Inspirational</option>
                          <option value="humorous">Humorous</option>
                        </select>
                      </label>
                      <label className="text-sm font-medium">
                        Niche
                        <select
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                          className="w-full h-10 mt-2 px-3 rounded-lg bg-muted border border-border/50"
                        >
                          <option value="general">General</option>
                          <option value="tech">Tech</option>
                          <option value="fashion">Fashion</option>
                          <option value="lifestyle">Lifestyle</option>
                          <option value="finance">Finance</option>
                          <option value="travel">Travel</option>
                          <option value="fitness">Fitness</option>
                          <option value="food">Food</option>
                        </select>
                      </label>
                    </div>

                    <Button
                      onClick={handleGenerateCaptions}
                      disabled={loadingCaptions || !topic.trim()}
                      className="w-full h-10 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-0 disabled:opacity-50"
                    >
                      {loadingCaptions ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Captions
                        </>
                      )}
                    </Button>
                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        ? {error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Caption Preview</h2>
                  <div className="rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 aspect-video flex items-center justify-center border-2 border-dashed border-border/50">
                    <div className="text-center p-6">
                      {loadingCaptions ? (
                        <>
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-pink-500" />
                          <p className="text-sm text-muted-foreground">Generating captions...</p>
                        </>
                      ) : captionList.length > 0 ? (
                        <p className="text-sm text-left whitespace-pre-wrap">{captionList[0]}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Caption preview appears here</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {captionList.length > 0 && (
                <div className="glass-card">
                  <h2 className="text-lg font-bold mb-4">Generated Captions</h2>
                  <div className="space-y-3">
                    {captionList.map((captionText, i) => (
                      <div key={i} className="p-4 rounded-lg bg-muted/30 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors">
                        <p className="text-sm whitespace-pre-wrap">{captionText}</p>
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(captionText, `cap-${i}`)}>
                          {copiedKey === `cap-${i}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-6 mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Upload Image / Video</h2>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center cursor-pointer hover:border-pink-500/50 transition-colors mb-4"
                  >
                    <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <div className="flex justify-center"><ImageIcon className="h-8 w-8 text-pink-500" /></div>
                        <p className="text-sm font-semibold">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm font-semibold">Select image or video</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, MP4, WebM</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Post Description</label>
                      <Textarea
                        placeholder="Describe the post, caption, and what you want to improve..."
                        value={mediaDescription}
                        onChange={(e) => setMediaDescription(e.target.value)}
                        className="min-h-24 bg-muted resize-none mt-2"
                      />
                    </div>

                    <Button
                      onClick={handleAnalyzeMedia}
                      disabled={loadingAnalysis || !mediaDescription.trim()}
                      className="w-full h-10 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-0 disabled:opacity-50"
                    >
                      {loadingAnalysis ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get Suggestions
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="glass-card">
                  <h2 className="text-xl font-bold mb-4">Media Preview</h2>
                  <div className="rounded-xl bg-muted overflow-hidden aspect-video flex items-center justify-center">
                    {mediaPreview ? (
                      mediaType === 'video' ? (
                        <video src={mediaPreview} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="text-center space-y-2">
                        <Film className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">Upload media to preview here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {mediaSuggestions && (
                <div className="glass-card">
                  <h2 className="text-lg font-bold mb-4">Post Suggestions</h2>
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap">{mediaSuggestions}</div>
                  <Button variant="outline" className="mt-4" onClick={() => handleCopy(mediaSuggestions, 'media-suggestions')}>
                    {copiedKey === 'media-suggestions' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />Copy Suggestions
                      </>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="hashtags" className="space-y-6 mt-6">
              <div className="glass-card">
                <h2 className="text-xl font-bold mb-4">Viral Hashtag Generator</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Topic</label>
                    <Textarea
                      placeholder="Enter the topic for hashtags: e.g. travel tips, AI marketing, fitness motivation"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-24 bg-muted resize-none mt-2"
                    />
                  </div>
                  <Button
                    onClick={handleGenerateHashtags}
                    disabled={loadingHashtags || !topic.trim()}
                    className="w-full h-10 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-0 disabled:opacity-50"
                  >
                    {loadingHashtags ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Hashtags...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate Viral Hashtags
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {hashtagData?.instagram && (
                <div className="glass-card space-y-6">
                  <h2 className="text-lg font-bold">Instagram Hashtags</h2>
                  {renderHashtagCategory(hashtagData.instagram.viral_high_competition, 'Viral / High Competition', <TrendingUp className="h-4 w-4 text-red-400" />, 'bg-red-500/15 text-red-400 hover:bg-red-500/25', 'ig-viral')}
                  {renderHashtagCategory(hashtagData.instagram.medium_competition, 'Medium Competition', <Target className="h-4 w-4 text-yellow-400" />, 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25', 'ig-medium')}
                  {renderHashtagCategory(hashtagData.instagram.low_competition_niche, 'Low Competition / Niche', <Hash className="h-4 w-4 text-green-400" />, 'bg-green-500/15 text-green-400 hover:bg-green-500/25', 'ig-niche')}
                  {renderHashtagCategory(hashtagData.instagram.long_tail, 'Long-Tail Tags', <Sparkles className="h-4 w-4 text-blue-400" />, 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25', 'ig-longtail')}
                </div>
              )}

              <div className="glass-card space-y-6">
                <h2 className="text-lg font-bold">YouTube + Twitter Hashtags</h2>
                {renderHashtagCategory(hashtagData?.youtube?.seo_keywords, 'YouTube SEO Keywords', <TrendingUp className="h-4 w-4 text-red-400" />, 'bg-red-500/15 text-red-400 hover:bg-red-500/25', 'yt-seo')}
                {renderHashtagCategory(hashtagData?.youtube?.video_tags, 'YouTube Video Tags', <Hash className="h-4 w-4 text-orange-400" />, 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25', 'yt-tags')}
                {renderHashtagCategory(hashtagData?.youtube?.long_tail_keywords, 'YouTube Long-Tail Keywords', <Target className="h-4 w-4 text-amber-400" />, 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25', 'yt-longtail')}
                {renderHashtagCategory(hashtagData?.youtube?.shorts_tags, 'YouTube Shorts Tags', <Zap className="h-4 w-4 text-pink-400" />, 'bg-pink-500/15 text-pink-400 hover:bg-pink-500/25', 'yt-shorts')}
                {renderHashtagCategory(hashtagData?.twitter?.trending, 'Twitter Trending', <TrendingUp className="h-4 w-4 text-blue-400" />, 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25', 'tw-trending')}
                {renderHashtagCategory(hashtagData?.twitter?.viral, 'Twitter Viral', <Zap className="h-4 w-4 text-cyan-400" />, 'bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25', 'tw-viral')}
                {renderHashtagCategory(hashtagData?.twitter?.conversation, 'Twitter Conversation', <Hash className="h-4 w-4 text-sky-400" />, 'bg-sky-500/15 text-sky-400 hover:bg-sky-500/25', 'tw-conversation')}
                {renderHashtagCategory(hashtagData?.twitter?.niche, 'Twitter Niche', <Target className="h-4 w-4 text-indigo-400" />, 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25', 'tw-niche')}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
