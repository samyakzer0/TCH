'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <motion.section 
      className="relative pt-24 pb-2 overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="bg-gradient-to-br from-[#E67E22] via-[#D35400] to-[#B66A55] w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center relative rounded-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Subtle steam/smoke background effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/3 left-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>

          {/* Main Title */}
          <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-4 sm:mb-6"
              >
                <Image
                  src="/images/gallery/logo1.png"
                  alt="The Chai House Logo"
                  width={80}
                  height={80}
                  className="object-contain mx-auto filter brightness-0 invert mb-2 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20"
                />
              </motion.div>
              
              <motion.h1 
                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-wider leading-tight mb-4 sm:mb-6 lg:mb-8"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                THE CHAI<br/>HOUSE
              </motion.h1>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-3 sm:space-y-4"
              >
                <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 max-w-2xl mx-auto">
                  Authentic Indian chai experience delivered fresh to your table
                </p>
                <motion.a
                  href="/order"
                  className="inline-block bg-white text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white/90 transition-colors shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Order Now
                </motion.a>
              </motion.div>
            </div>
          </div>

          {/* Clay Cup Image */}
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Image
              src="/images/kulhad-cup.png"
              alt="Traditional Clay Kulhad Cup"
              width={500}
              height={600}
              className="w-auto h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Steam Effect - Starting from clay cup */}
          <motion.div 
            className="absolute bottom-[80px] sm:bottom-[100px] md:bottom-[120px] lg:bottom-[140px] left-1/2 transform -translate-x-1/2 z-25"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            <motion.div
              animate={{ 
                y: [-15, -25, -15],
                opacity: [0.7, 0.9, 0.7],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Image
                src="/images/steam.png"
                alt="Steam effect"
                width={240}
                height={320}
                className="w-auto h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px] object-contain opacity-80"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
