'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const cafeLocation = {
  id: 1,
  city: 'Indore',
  branch: 'Branch Location',
  address: '33-A Silicon City, Indore (M.P) 452012',
  hours: 'Mon - Sun: 7:00 AM - 7:00 PM',
  phone: '671102xxxx',
  email: 'thechaihouse@fun',
  mapLink: 'https://maps.app.goo.gl/xoLpC13jH3xkZm3XA',
  image: 'cafe1'
}

export default function LocationsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.3
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

  const imageVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const contentVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  }

  return (
    <main className="bg-[#F5F6FC] min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="relative pt-24 pb-12 overflow-hidden px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="bg-primary w-full h-[45vh] flex items-center justify-center relative rounded-3xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative z-10 text-center px-6">
              <motion.h1 
                className="text-white text-5xl md:text-7xl lg:text-8xl font-black tracking-wider leading-tight mb-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                JUST COME
              </motion.h1>
              <motion.p 
                className="text-white/90 text-lg md:text-xl max-w-md mx-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                You won't regret it.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Location Section */}
      <motion.section 
        className="py-8 px-4 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100"
          variants={itemVariants}
          whileHover={{ 
            y: -8,
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <motion.div 
              className="relative h-80 lg:h-auto order-2 lg:order-1"
              variants={imageVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <Image
                  src="https://readdy.ai/api/search-image?query=Modern%20coffee%20shop%20interior%20with%20warm%20lighting%2C%20wooden%20furniture%2C%20people%20enjoying%20coffee%2C%20professional%20architectural%20photography&width=600&height=500&seq=cafe1&orientation=landscape"
                  alt="The Chai House NYC Location"
                  width={600}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <motion.div 
              className="p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2"
              variants={contentVariants}
            >
              <div className="mb-8">
                <motion.p 
                  className="text-sm text-gray-500 mb-3 uppercase tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {cafeLocation.branch}
                </motion.p>
                <motion.h2 
                  className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight"
                  whileHover={{ color: "#8000FF" }}
                  transition={{ duration: 0.3 }}
                >
                  {cafeLocation.city}
                </motion.h2>
              </div>

              <div className="space-y-6 mb-10">
                <motion.div 
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg leading-relaxed">{cafeLocation.address}</span>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg leading-relaxed">{cafeLocation.hours}</span>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg leading-relaxed">{cafeLocation.phone}</span>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4"
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-lg leading-relaxed">{cafeLocation.email}</span>
                </motion.div>
              </div>

              <motion.a
                href={cafeLocation.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-primary/90 w-full sm:w-auto"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(128, 0, 255, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                View on maps
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      <Footer />
    </main>
  )
}
