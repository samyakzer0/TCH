'use client'

import { motion } from 'framer-motion'

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
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ 
                scale: 1.1, 
                rotate: 180,
                backgroundColor: "rgba(255, 255, 255, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white text-2xl">||</span>
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
            className="flex justify-center space-x-8 mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {[
              { name: 'Home', href: '/' },
              { name: 'Menu', href: '/menu' },
              { name: 'Locations', href: '/locations' }
            ].map((item, index) => (
              <motion.a 
                key={item.name}
                href={item.href} 
                className="hover:text-secondary transition-colors"
                whileHover={{ y: -2, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.footer>
  )
}
