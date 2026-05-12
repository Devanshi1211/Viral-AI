import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Simple mock state to persist user during session
let mockUser: any = null
let authChangeListeners: Array<(event: string, session: any) => void> = []

// Mock Supabase Client for Hackathon fallback
const createMockClient = () => {
  console.warn("⚠️ Using Mock Supabase Client because the project URL is unreachable or invalid.")
  
  return {
    auth: {
      getSession: async () => ({ data: { session: mockUser ? { user: mockUser, access_token: 'mock-token' } : null }, error: null }),
      onAuthStateChange: (callback: any) => {
        authChangeListeners.push(callback)
        // Immediately trigger with current state
        callback('SIGNED_IN', mockUser ? { user: mockUser, access_token: 'mock-token' } : null)
        return { data: { subscription: { unsubscribe: () => {
          authChangeListeners = authChangeListeners.filter(l => l !== callback)
        } } } }
      },
      signInWithPassword: async ({ email }: any) => {
        mockUser = { id: 'mock-user-id', email, user_metadata: {} }
        const session = { user: mockUser, access_token: 'mock-token' }
        // Notify listeners
        authChangeListeners.forEach(l => l('SIGNED_IN', session))
        return { data: { user: mockUser, session }, error: null }
      },
      signUp: async ({ email }: any) => {
        mockUser = { id: 'mock-user-id', email, user_metadata: {} }
        const session = { user: mockUser, access_token: 'mock-token' }
        // Notify listeners
        authChangeListeners.forEach(l => l('SIGNED_UP', session))
        return { data: { user: mockUser, session }, error: null }
      },
      signOut: async () => {
        mockUser = null
        authChangeListeners.forEach(l => l('SIGNED_OUT', null))
        return { error: null }
      },
      getUser: async () => ({ data: { user: mockUser }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: {}, error: null }),
          order: () => ({ data: [], error: null }),
        }),
        order: () => ({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: {}, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: {}, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
  } as any
}

// Check if URL is the known dead one or missing
const isUrlDead = !env.NEXT_PUBLIC_SUPABASE_URL || 
                 env.NEXT_PUBLIC_SUPABASE_URL.includes("jthnophgvmduyywbzgmb") ||
                 env.NEXT_PUBLIC_SUPABASE_URL === "https://your-project.supabase.co"

export const supabase = isUrlDead 
  ? createMockClient() 
  : createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)