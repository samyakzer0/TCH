'use client'

import { useState, useEffect } from 'react'
import AdminLogin from '../../components/AdminLogin'
import AdminDashboard from '../../components/AdminDashboard'
import { useAuth } from '../../components/AuthProvider'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  const { user: supabaseUser, loading: authLoading, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)

    // Check if Supabase session is active (e.g. after Google OAuth redirect)
    if (supabaseUser) {
      setIsAuthenticated(true)
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
        avatar_url: supabaseUser.user_metadata?.avatar_url,
        role: 'owner',
        auth_provider: 'google'
      })
      return
    }

    // Check if user is logged in via traditional credentials in localStorage
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    
    if (token && userData) {
      try {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      } catch (e) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    }
  }, [supabaseUser])

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true)
    setUser(userData.user)
    localStorage.setItem('admin_token', userData.token)
    localStorage.setItem('admin_user', JSON.stringify(userData.user))
  }

  const handleLogout = async () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    await signOut()
  }

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Loading admin portal...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
    </main>
  )
}
