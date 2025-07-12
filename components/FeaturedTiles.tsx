'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function FeaturedTiles() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marqueeContent = document.querySelector('.marquee-content')
    const marqueeContainer = document.querySelector('.marquee')
    
    if (marqueeContent && marqueeContainer) {
      const clonedContent = marqueeContent.cloneNode(true)
      marqueeContainer.appendChild(clonedContent)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.section 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto -mt-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="col-span-1 md:col-span-2 h-80 bg-[#FF5733] rounded-2xl overflow-hidden relative cursor-pointer"
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="https://readdy.ai/api/search-image?query=Delicious%20pastry%20with%20jam%20filling%20on%20vibrant%20orange%20background%2C%20close-up%20shot%20showing%20texture%20and%20details%2C%20professional%20food%20photography%2C%20commercial%20quality%2C%20perfect%20for%20bakery%20marketing&width=800&height=500&seq=pastry1&orientation=landscape"
          alt="Pastry"
          width={800}
          height={500}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <motion.h2 
            className="text-white text-4xl font-bold"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Hungry?
          </motion.h2>
        </div>
      </motion.div>
      
      <motion.div 
        className="col-span-1 h-80 bg-secondary rounded-2xl overflow-hidden relative cursor-pointer"
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8 flex flex-col h-full justify-between">
          <div>
            <motion.h3 
              className="text-gray-800 text-2xl font-bold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Stressed?
            </motion.h3>
            <motion.p 
              className="text-gray-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Have a Cup!
            </motion.p>
          </div>
          <div className="absolute bottom-0 right-0 p-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
            >
              <Image
                src="images/chai.png"
                alt="Coffee Bag"
                width={300}
                height={400}
                className="w-40 h-auto"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="col-span-1 h-80 bg-[#3A3426] rounded-2xl overflow-hidden relative cursor-pointer"
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="images/tea.png"
          alt="Chai"   
          width={500}
          height={500}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div 
            className="bg-white bg-opacity-90 rounded-full p-4 w-24 h-24 flex items-center justify-center"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.9, duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 360 }}
          >
            <div className="text-center">
            
              <p className="text-xs font-medium mt-1">Made With Love ❤️</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="col-span-1 md:col-span-2 h-40 bg-primary rounded-2xl overflow-hidden relative"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="marquee h-full flex items-center" ref={marqueeRef}>
  <div className="marquee-content flex space-x-6 px-4">
    {[
      'Freshly Brewed',
      'Chai is Love',
      'Baked Daily',
      'Steamy Sips',
      'Just Chill',
      'Flavor Burst',
      'Hot & Frothy',
      'Sip. Relax. Repeat.'
    ].map((item, index) => (
      <motion.span 
        key={index}
        className="bg-white text-primary px-4 py-2 rounded-full font-medium whitespace-nowrap"
        whileHover={{ scale: 1.1, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {item}
      </motion.span>
    ))}
    {[
      'Freshly Brewed',
      'Chai is Love',
      'Baked Daily',
      'Steamy Sips',
      'Just Chill',
      'Flavor Burst',
      'Hot & Frothy',
      'Sip. Relax. Repeat.'
    ].map((item, index) => (
      <motion.span 
        key={index + 10}
        className="bg-white text-primary px-4 py-2 rounded-full font-medium whitespace-nowrap"
        whileHover={{ scale: 1.1, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {item}
      </motion.span>
    ))}
  </div>
</div>
      </motion.div>
    </motion.section>
  )
}
