'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
// Correct the import path if the file exists elsewhere, for example:
import OrderingSystem from '../../components/OrderingSystem'

export default function OrderPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-[#F5F6FC] min-h-screen">
      <Header />
      <div className="pt-20">
        <OrderingSystem />
      </div>
      <Footer />
    </main>
  )
}
