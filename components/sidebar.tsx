'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Instagram,
  Youtube,
  Twitter,
  TrendingUp,
  Zap,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard',        href: '/' },
  { icon: Instagram,       label: 'Instagram',        href: '/instagram' },
  { icon: Youtube,         label: 'YouTube',          href: '/youtube' },
  { icon: Twitter,         label: 'Twitter / X',      href: '/twitter' },
  { icon: TrendingUp,      label: 'Trend Explorer',   href: '/trends' },
  { icon: Zap,             label: 'Content Generator',href: '/generator' },
  { icon: BarChart3,       label: 'Analytics',        href: '/analytics' },
]

const bottomNavItems = [
  { icon: Settings,   label: 'Settings',     href: '/settings' },
  { icon: HelpCircle, label: 'Help & Support',href: '/settings' },
  { icon: User,       label: 'Profile',      href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen flex flex-col',
          'border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-64'
        )}
        style={{ background: 'oklch(0.09 0.03 280)' }}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center border-b border-sidebar-border',
            'transition-all duration-300',
            collapsed ? 'justify-center px-0 py-5' : 'gap-3 px-5 py-5'
          )}
        >
          {/* Icon */}
          <div className="relative flex-shrink-0">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, oklch(0.62 0.25 280), oklch(0.58 0.22 240))',
                boxShadow: '0 4px 12px oklch(0.62 0.25 280 / 0.4)',
              }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Text */}
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold leading-tight tracking-tight">ViralAI</h1>
              <p className="text-[11px] font-medium" style={{ color: 'oklch(0.68 0.25 260)' }}>
                AI Content Intelligence
              </p>
            </div>
          )}

          {/* Collapse toggle (desktop) */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto rounded-lg p-1 opacity-40 hover:opacity-100 hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand button */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-2 rounded-lg p-1.5 opacity-40 hover:opacity-100 hover:bg-white/10 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'oklch(0.50 0.04 280)' }}>
              Main Menu
            </p>
          )}
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  'transition-all duration-200 group relative',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'nav-item-active'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/6'
                )}
              >
                <Icon
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    collapsed ? 'h-5 w-5' : 'h-4.5 w-4.5',
                    isActive
                      ? 'text-[oklch(0.68_0.25_260)]'
                      : 'group-hover:text-sidebar-foreground'
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Tooltip for collapsed */}
                {collapsed && (
                  <span
                    className="absolute left-full ml-3 hidden group-hover:block z-50 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium"
                    style={{
                      background: 'oklch(0.18 0.03 280)',
                      border: '1px solid oklch(0.28 0.04 280)',
                      color: 'white',
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-sidebar-border" />

        {/* Bottom Nav */}
        <nav className="px-2 py-3 space-y-0.5">
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'oklch(0.50 0.04 280)' }}>
              Account
            </p>
          )}
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={`bottom-${item.label}`}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  'transition-all duration-200 group relative',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'nav-item-active'
                    : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/6'
                )}
              >
                <Icon
                  className={cn(
                    'flex-shrink-0',
                    collapsed ? 'h-5 w-5' : 'h-4 w-4'
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span
                    className="absolute left-full ml-3 hidden group-hover:block z-50 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium"
                    style={{
                      background: 'oklch(0.18 0.03 280)',
                      border: '1px solid oklch(0.28 0.04 280)',
                      color: 'white',
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-sidebar-border px-5 py-4">
            <p className="text-[11px]" style={{ color: 'oklch(0.42 0.04 280)' }}>
              © 2024 ViralAI · v1.0
            </p>
          </div>
        )}
      </aside>

      {/* Spacer to push page content */}
      <div
        className={cn('transition-all duration-300', collapsed ? 'pl-[68px]' : 'pl-64')}
        style={{ display: 'none' }}
      />
    </>
  )
}
