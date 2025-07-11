'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActiveNav = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Order Now', href: '/order' },
    { name: 'Track Order', href: '/track' },
    { name: 'Locations', href: '/locations' }
  ]

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-full flex justify-center">
          <motion.div
            className={`bg-white/90 backdrop-blur-md rounded-full py-3 px-6 flex items-center gap-8 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="text-primary text-2xl font-pacifico">
                TCH
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors px-3 py-2 rounded-full ${
                      isActiveNav(item.href)
                        ? 'text-white bg-primary'
                        : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden w-8 h-8 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={mobileMenuOpen ? 'open' : 'closed'}
                className="w-5 h-5 flex flex-col justify-center items-center relative"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: -3 },
                    open: { rotate: 45, y: 0 }
                  }}
                  className="w-5 h-0.5 bg-primary absolute"
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  className="w-5 h-0.5 bg-primary absolute"
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 3 },
                    open: { rotate: -45, y: 0 }
                  }}
                  className="w-5 h-0.5 bg-primary absolute"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl min-w-[250px]"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <nav className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className={`font-medium py-3 px-4 rounded-xl transition-all text-center block ${
                        isActiveNav(item.href)
                          ? 'text-white bg-primary'
                          : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
