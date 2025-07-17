'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <motion.footer 
      className="mx-4 mb-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="bg-primary py-16 px-4 text-white rounded-2xl"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            className="mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/gallery/logo1.png"
                alt="The Chai House Logo"
                width={60}
                height={60}
                className="object-contain filter brightness-0 invert"
              />
            </motion.div>
            <motion.h2 
              className="text-4xl font-black mb-6 tracking-tight"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              The Chai House
            </motion.h2>
          </motion.div>
          <motion.div 
            className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {[
              { name: 'Home', href: '/' },
              { name: 'Menu', href: '/menu' },
              { name: 'Order Now', href: '/order' },
              { name: 'Track Order', href: '/track' },
              { name: 'Locations', href: '/locations' }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link 
                  href={item.href} 
                  className="text-white/90 hover:text-white transition-colors font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Contact Info */}
          <motion.div 
            className="text-center text-white/80 text-sm mb-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
  
          </motion.div>
        </div>
      </motion.div>
    </motion.footer>
  )
}
