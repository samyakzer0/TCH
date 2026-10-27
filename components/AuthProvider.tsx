'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../lib/supabaseClient'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  isSupabaseEnabled: boolean
  signInWithGoogle: (redirectTo?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  isSupabaseEnabled: false,
  signInWithGoogle: async () => {},
  signOut: async () => {}
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const isSupabaseEnabled = isSupabaseConfigured()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      setLoading(false)
      return
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      checkAdminStatus(currentUser)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      checkAdminStatus(currentUser)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkAdminStatus = (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false)
      return
    }

    const email = currentUser.email?.toLowerCase() || ''
    const defaultAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@thechai.house').toLowerCase()

    // Email matches configured admin or admin domain
    if (email === defaultAdminEmail || email.endsWith('@thechai.house')) {
      setIsAdmin(true)
    } else {
      // In Supabase, can also be checked against admin_users table
      setIsAdmin(true) // Allow Google authenticated users to access with staff/viewer permissions
    }
  }

  const signInWithGoogle = async (redirectTo?: string) => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      alert('Supabase is not configured yet. Please configure your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      return
    }

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
    const callbackUrl = `${currentOrigin}/auth/callback?next=${encodeURIComponent(redirectTo || '/admin')}`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (error) {
      console.error('Error signing in with Google:', error.message)
      throw error
    }
  }

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setIsAdmin(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        isSupabaseEnabled,
        signInWithGoogle,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
