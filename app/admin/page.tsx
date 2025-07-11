'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLogin from '../../components/AdminLogin'
import AdminDashboard from '../../components/AdminDashboard'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user is already logged in
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true)
    setUser(userData.user)
    localStorage.setItem('admin_token', userData.token)
    localStorage.setItem('admin_user', JSON.stringify(userData.user))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  if (!mounted) return null

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
