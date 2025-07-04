'use client'

import { motion } from 'framer-motion'

export default function StayInTouchSection() {
  return (
    <motion.section 
      className="mx-4 mb-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="bg-secondary py-16 px-4 rounded-2xl"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 mb-4"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Stay in touch!
          </motion.h2>
          <motion.p 
            className="text-gray-700 mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Latest offers, news, & updates to your inbox
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-xl border-none text-sm bg-white"
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(128, 0, 255, 0.1)" }}
              transition={{ duration: 0.2 }}
            />
            <motion.button 
              className="bg-primary text-white px-6 py-3 rounded-xl font-medium whitespace-nowrap"
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#9000FF",
                boxShadow: "0 8px 25px rgba(128, 0, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Subscribe
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
