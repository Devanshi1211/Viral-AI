'use client'

import { Bell, Search, Moon, Sun, User, LogOut, Zap, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (!mounted) {
    return null
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <nav
      className="fixed top-0 right-0 z-30"
      style={{
        left: 'var(--sidebar-width, 256px)',
        borderBottom: '1px solid var(--border)',
        background: 'oklch(var(--background) / 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex h-[58px] items-center justify-between px-6 gap-4">

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search trends, hashtags, creators..."
              className="pl-9 h-8 text-sm rounded-xl"
              style={{
                background: 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {/* ML Status Indicator */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: 'oklch(0.72 0.19 150 / 0.1)',
              border: '1px solid oklch(0.72 0.19 150 / 0.2)',
              color: 'oklch(0.72 0.19 150)',
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ background: 'oklch(0.72 0.19 150)' }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ background: 'oklch(0.72 0.19 150)' }}
              />
            </span>
            ML Online
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 p-0 rounded-lg hover:bg-muted"
            id="nav-notifications-btn"
          >
            <Bell className="h-4 w-4" />
            <span
              className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full"
              style={{ background: 'oklch(0.65 0.22 25)' }}
            />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            id="nav-theme-toggle"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Divider */}
          <div className="h-5 w-px bg-border mx-1" />

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted transition-colors outline-none"
                id="nav-profile-menu"
              >
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.62 0.25 280), oklch(0.58 0.22 240))',
                  }}
                >
                  {user?.email ? getInitials(user.email) : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold leading-tight max-w-[100px] truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Creator</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 mt-1">
              <div className="px-3 py-2.5">
                <p className="text-sm font-semibold truncate">{user?.email || 'User'}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Zap className="h-3 w-3" style={{ color: 'oklch(0.68 0.25 260)' }} />
                  <p className="text-xs text-muted-foreground">ViralAI Pro</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2" id="nav-profile-item">
                <User className="h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2" id="nav-settings-item">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={handleSignOut}
                id="nav-signout-item"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
