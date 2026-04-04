'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Lock,
  Bell,
  Shield,
  LogOut,
  Zap,
  Instagram,
  Youtube,
  Twitter,
  AlertCircle,
  Check,
  Loader2,
  ExternalLink,
  Unplug,
} from 'lucide-react'

interface ConnectionInfo {
  connected: boolean
  configured: boolean
}

interface Connections {
  instagram: ConnectionInfo
  facebook: ConnectionInfo
  twitter: ConnectionInfo
}

export default function SettingsClient() {
  const searchParams = useSearchParams()
  const [connections, setConnections] = useState<Connections>({
    instagram: { connected: false, configured: false },
    facebook: { connected: false, configured: false },
    twitter: { connected: false, configured: false },
  })
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')

    if (connected === 'meta') {
      setStatusMessage('✅ Instagram / Facebook connected successfully!')
      setTimeout(() => setStatusMessage(''), 5000)
    } else if (connected === 'x') {
      setStatusMessage('✅ Twitter/X connected successfully!')
      setTimeout(() => setStatusMessage(''), 5000)
    } else if (error) {
      setStatusMessage(`❌ Connection error: ${decodeURIComponent(error)}`)
      setTimeout(() => setStatusMessage(''), 8000)
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/auth/status')
        const data = await res.json()
        if (data.success) {
          setConnections(data.connections)
        }
      } catch {
        console.error('Failed to fetch connection status')
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [statusMessage])

  const handleConnect = (platform: string) => {
    if (platform === 'instagram' || platform === 'facebook') {
      window.location.href = '/api/auth/meta/login'
    } else if (platform === 'twitter') {
      window.location.href = '/api/auth/x/login'
    }
  }

  const handleDisconnect = async (platform: string) => {
    setDisconnecting(platform)
    try {
      const apiPlatform =
        platform === 'instagram' || platform === 'facebook' ? 'meta' : 'x'
      const res = await fetch('/api/auth/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: apiPlatform }),
      })
      const data = await res.json()
      if (data.success) {
        setStatusMessage(`✅ Disconnected from ${platform}`)
        setTimeout(() => setStatusMessage(''), 3000)
      }
    } catch {
      setStatusMessage('❌ Failed to disconnect')
    } finally {
      setDisconnecting(null)
    }
  }

  const platforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      description: 'Connect your Instagram Business account for insights and optimization',
      key: 'instagram',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      description: 'Connect your X account to analyze tweets and post content',
      key: 'twitter',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      description: 'Get video analytics and SEO recommendations (coming soon)',
      key: 'youtube',
      gradient: 'from-red-500 to-orange-500',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />

      <main className="ml-64 mt-16 p-6">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account, preferences, and integrations
            </p>
          </div>

          {statusMessage && (
            <div
              className={`p-4 rounded-lg border text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
                statusMessage.startsWith('✅')
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {statusMessage}
            </div>
          )}

          <Tabs defaultValue="integrations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="integrations" className="space-y-6 mt-6">
              <div className="glass-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Connected Platforms</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect your social media accounts for real analytics and posting
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon
                    const conn = connections[platform.key as keyof Connections]
                    const isConnected = conn?.connected
                    const isConfigured = conn?.configured
                    const isDisconnecting = disconnecting === platform.key
                    const isYouTube = platform.key === 'youtube'

                    return (
                      <div
                        key={platform.key}
                        className="p-4 rounded-lg bg-muted/30 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-12 w-12 rounded-lg bg-gradient-to-br ${platform.gradient} flex items-center justify-center`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{platform.name}</p>
                              {isConnected && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                  Connected
                                </span>
                              )}
                              {!isConfigured && !isYouTube && (
                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                  Not Configured
                                </span>
                              )}
                              {isYouTube && (
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {platform.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {isConnected ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisconnect(platform.key)}
                              disabled={isDisconnecting}
                              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                            >
                              {isDisconnecting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Unplug className="mr-1 h-3 w-3" />
                                  Disconnect
                                </>
                              )}
                            </Button>
                          ) : isYouTube ? (
                            <Button variant="ghost" size="sm" disabled>
                              Coming Soon
                            </Button>
                          ) : isConfigured ? (
                            <Button
                              size="sm"
                              onClick={() => handleConnect(platform.key)}
                              disabled={loading}
                              className={`bg-gradient-to-r ${platform.gradient} text-white border-0 hover:opacity-90`}
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <ExternalLink className="mr-1 h-3 w-3" />
                                  Connect
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(
                                  platform.key === 'twitter'
                                    ? 'https://developer.x.com/'
                                    : 'https://developers.facebook.com/apps/',
                                  '_blank'
                                )
                              }
                            >
                              <Zap className="mr-1 h-3 w-3" />
                              Setup
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {(!connections.instagram.configured ||
                  !connections.twitter.configured) && (
                  <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm font-medium text-blue-400 mb-2">
                      📋 Setup Instructions
                    </p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      {!connections.instagram.configured && (
                        <>
                          <li>
                            Go to{' '}
                            <a
                              href="https://developers.facebook.com/apps/"
                              target="_blank"
                              className="text-blue-400 underline"
                            >
                              Meta Developer Portal
                            </a>{' '}
                            → Create a Business app
                          </li>
                          <li>
                            Add Instagram API + Facebook Login products
                          </li>
                          <li>
                            Copy App ID &amp; App Secret to{' '}
                            <code className="text-xs bg-muted px-1 rounded">
                              .env.local
                            </code>
                          </li>
                        </>
                      )}
                      {!connections.twitter.configured && (
                        <>
                          <li>
                            Go to{' '}
                            <a
                              href="https://developer.x.com/"
                              target="_blank"
                              className="text-blue-400 underline"
                            >
                              X Developer Portal
                            </a>{' '}
                            → Create an app
                          </li>
                          <li>
                            Set OAuth 2.0 callback URL to:{' '}
                            <code className="text-xs bg-muted px-1 rounded">
                              http://localhost:3000/api/auth/x/callback
                            </code>
                          </li>
                          <li>
                            Copy Client ID &amp; Secret to{' '}
                            <code className="text-xs bg-muted px-1 rounded">
                              .env.local
                            </code>
                          </li>
                        </>
                      )}
                      <li>Restart the dev server after updating .env.local</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="glass-card">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5" />
                  <h3 className="text-lg font-bold">API Keys</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your API keys for AI content generation
                </p>

                <div className="space-y-3">
                  {[
                    {
                      name: 'AI Engine (Kimi K2.5)',
                      status: 'Active',
                      active: true,
                    },
                    {
                      name: 'Gemini (Fallback)',
                      status: 'Active',
                      active: true,
                    },
                  ].map((api) => (
                    <div
                      key={api.name}
                      className="p-3 rounded-lg bg-muted/30 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{api.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              api.active ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {api.status}
                          </span>
                        </div>
                      </div>
                      <code className="text-xs text-muted-foreground">
                        ••••••••••••
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-6">
              <div className="glass-card">
                <h3 className="text-lg font-bold mb-6">Content Preferences</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Primary Content Niche
                    </label>
                    <select className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50">
                      <option>Technology</option>
                      <option>Fashion</option>
                      <option>Finance</option>
                      <option>Lifestyle</option>
                      <option>Entertainment</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Preferred Language
                    </label>
                    <select className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Default Content Tone
                    </label>
                    <select className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Viral</option>
                      <option>Educational</option>
                      <option>Humorous</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <Button className="w-full">Save Preferences</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="glass-card">
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="h-5 w-5" />
                  <h3 className="text-lg font-bold">Notification Settings</h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Trending Topics',
                      description:
                        'Get notified when new trends are detected',
                    },
                    {
                      title: 'Performance Alerts',
                      description:
                        'Alerts when your content gets high engagement',
                    },
                    {
                      title: 'Weekly Digest',
                      description: 'Receive weekly analytics summary',
                    },
                    {
                      title: 'Best Posting Times',
                      description: 'Reminders to post at optimal times',
                    },
                  ].map((notif) => (
                    <div
                      key={notif.title}
                      className="p-3 rounded-lg bg-muted/30 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {notif.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <Button className="w-full">
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-6 mt-6">
              <div className="glass-card">
                <h3 className="text-lg font-bold mb-6">
                  Profile Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue="johndoe"
                      className="w-full h-10 px-3 rounded-lg bg-muted border border-border/50"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <Button className="w-full">Update Profile</Button>
                </div>
              </div>

              <div className="glass-card">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="h-5 w-5" />
                  <h3 className="text-lg font-bold">
                    Password &amp; Security
                  </h3>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>

              <div className="glass-card border-red-500/20">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-bold text-red-500">
                    Danger Zone
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back.
                  Please be certain.
                </p>

                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
