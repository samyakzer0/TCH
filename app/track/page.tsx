'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import OrderStatusTracker from '../../components/OrderStatusTracker'

export default function TrackOrderPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-[#F5F6FC] min-h-screen">
      <Header />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your order number to check the status</p>
          </div>
          <OrderStatusTracker />
        </div>
      </div>
      <Footer />
    </main>
  )
}
