'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Your cafe gallery images - replace with actual photos
const cafeImages = [
  {
    id: "1",
    img: "/images/gallery/gallery-1.jpg",
    alt: "Chai House Interior",
  },
  {
    id: "2", 
    img: "/images/gallery/gallery-2.jpg",
    alt: "Traditional Kulhad Chai",
  },
  {
    id: "3",
    img: "/images/gallery/gallery-3.jpg",
    alt: "Chai Preparation",
  },
  {
    id: "4",
    img: "/images/gallery/gallery-4.jpg",
    alt: "Cozy Seating Area",
  },
  {
    id: "5",
    img: "/images/gallery/gallery-5.jpg",
    alt: "Chai Ingredients",
  }
];

export default function GallerySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const imageVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.section 
      className="py-12 md:py-16 px-4 max-w-7xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-8 md:mb-12"
        variants={itemVariants}
      >
        <motion.div 
          className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </motion.div>
        <motion.h2 
          className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-3 md:mb-4"
          variants={itemVariants}
        >
          Because Chai fixes everything
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg"
          variants={itemVariants}
        >
          Step into the warmth of traditional chai culture. Discover the moments that make our cafe special.
        </motion.p>
      </motion.div>
      
      {/* Responsive Grid Layout */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6"
        variants={containerVariants}
      >
        {cafeImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="group cursor-pointer"
            variants={imageVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={image.img}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  priority={index < 2}
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
