'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from './AuthProvider'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

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
        <div className="w-full flex justify-center px-4">
          <motion.div
            className={`bg-white/95 backdrop-blur-md rounded-full py-2.5 px-6 flex items-center gap-6 sm:gap-8 transition-all duration-300 ${scrolled ? 'shadow-lg border border-gray-100' : 'shadow-md'}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="text-primary text-2xl font-pacifico tracking-tight">
                TCH
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors px-3.5 py-1.5 rounded-full ${
                      isActiveNav(item.href)
                        ? 'text-white bg-primary shadow-sm'
                        : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Auth / Admin Section */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    title={`Signed in as ${user.email} (Open Admin)`}
                    className="flex items-center gap-2 p-1 pl-2 pr-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full border border-gray-300"
                      />
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                        {(user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    title="Sign Out"
                    className="text-[11px] text-gray-500 hover:text-red-600 px-1.5 py-1 rounded transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin"
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                    pathname === '/admin'
                      ? 'text-white bg-primary'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5 border border-gray-200'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden w-8 h-8 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={mobileMenuOpen ? 'open' : 'closed'}
                className="w-5 h-5 flex flex-col justify-center items-center relative"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: -4 },
                    open: { rotate: 45, y: 0 }
                  }}
                  className="w-5 h-0.5 bg-primary absolute"
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  className="w-5 h-0.5 bg-primary absolute"
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 4 },
                    open: { rotate: -45, y: 0 }
                  }}
                  className="w-5 h-0.5 bg-primary absolute"
                  transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-100 max-w-sm mx-auto"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-medium py-2.5 px-4 rounded-xl transition-all text-center block text-sm ${
                      isActiveNav(item.href)
                        ? 'text-white bg-primary shadow-sm'
                        : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-2 mt-2 border-t border-gray-100">
                  <Link
                    href="/admin"
                    className="font-medium py-2.5 px-4 rounded-xl transition-all text-center block text-sm text-primary bg-primary/10 hover:bg-primary/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {user ? `Admin Panel (${user.email})` : 'Admin Sign In'}
                  </Link>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
