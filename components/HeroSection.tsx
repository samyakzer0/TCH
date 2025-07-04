'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <motion.section 
      className="relative pt-20 overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="bg-gradient-to-br from-[#E67E22] via-[#D35400] to-[#B66A55] w-full h-[70vh] md:h-[80vh] flex items-center justify-center relative rounded-2xl overflow-hidden"
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
        <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
          <motion.h1 
            className="text-white text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-wider leading-tight text-center"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            KULHAD<br/>CHAI
          </motion.h1>
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
            className="w-auto h-[300px] md:h-[400px] object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Steam Effect */}
        <motion.div 
          className="absolute bottom-[220px] md:bottom-[300px] left-1/2 transform -translate-x-1/2 z-25"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <motion.div
            animate={{ 
              y: [-10, -20, -10],
              opacity: [0.6, 0.8, 0.6],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Image
              src="/images/steam.png"
              alt="Steam effect"
              width={180}
              height={250}
              className="w-auto h-[120px] md:h-[180px] object-contain opacity-70"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
