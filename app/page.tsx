import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { OverviewCards } from '@/components/dashboard/overview-cards'
import { TrendEngine } from '@/components/dashboard/trend-engine'
import { ViralPredictor } from '@/components/dashboard/viral-predictor'
import { ProtectedRoute } from '@/components/protected-route'
import { Sparkles, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Navbar />

        {/* Main Content — offset by sidebar width */}
        <main className="ml-64 pt-[58px]">
          <div className="px-6 py-8 space-y-8 max-w-[1400px]">

            {/* ── Hero Header ── */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in">
              <div>
                <h1 className="text-3xl font-bold leading-tight">
                  Good afternoon 👋
                </h1>
                <p className="text-muted-foreground mt-1.5 text-base max-w-md">
                  Turn your content data into your next viral post.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link href="/generator">
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-muted border border-border"
                    id="dashboard-generate-btn"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Content
                  </button>
                </Link>
                <Link href="/trends">
                  <button
                    className="btn-gradient flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    id="dashboard-analyze-btn"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Analyze Content
                  </button>
                </Link>
              </div>
            </div>

            {/* ── KPI Cards ── */}
            <section className="animate-fade-in-1">
              <OverviewCards />
            </section>

            {/* ── Main Grid ── */}
            <section className="grid gap-6 xl:grid-cols-5 animate-fade-in-2">
              {/* Trend Engine — takes 2 cols */}
              <div className="xl:col-span-2">
                <TrendEngine />
              </div>

              {/* Viral Predictor — takes 3 cols */}
              <div className="xl:col-span-3">
                <ViralPredictor />
              </div>
            </section>

            {/* ── Quick Start Guides ── */}
            <section className="animate-fade-in-3">
              <div className="vi-card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold">Quick Start Guides</h2>
                  <span className="text-xs text-muted-foreground">Jump into action</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Instagram Optimization',
                      description: 'Create viral-worthy Instagram posts with AI suggestions',
                      icon: '📸',
                      color: 'from-pink-500/10 to-rose-500/10',
                      border: 'border-pink-500/20',
                      href: '/instagram',
                    },
                    {
                      title: 'YouTube SEO',
                      description: 'Generate optimized titles, descriptions, and hashtags',
                      icon: '🎬',
                      color: 'from-red-500/10 to-orange-500/10',
                      border: 'border-red-500/20',
                      href: '/youtube',
                    },
                    {
                      title: 'Twitter Threads',
                      description: 'Craft engaging Twitter threads that drive engagement',
                      icon: '𝕏',
                      color: 'from-blue-500/10 to-cyan-500/10',
                      border: 'border-blue-500/20',
                      href: '/twitter',
                    },
                  ].map((guide) => (
                    <Link key={guide.title} href={guide.href}>
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-br ${guide.color} border ${guide.border} hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}
                        id={`dashboard-guide-${guide.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <p className="text-2xl mb-3">{guide.icon}</p>
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {guide.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
