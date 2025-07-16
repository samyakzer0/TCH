'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const products = [
  { name: 'Flores', description: 'Medium roast, fruity, 250g', price: '₹ 8.90', seq: 'coffeebag2' },
  { name: 'Sumatra', description: 'Dark roast, earthy, 250g', price: '₹ 9.50', seq: 'coffeebag3' },
  { name: 'Tigerlake', description: 'Medium-dark roast, nutty, 250g', price: '₹ 8.40', seq: 'coffeebag4' },
  { name: 'Andes', description: 'Light roast, floral, 250g', price: '₹ 9.90', seq: 'coffeebag5' },
  { name: 'Bali', description: 'Medium roast, chocolate notes, 250g', price: '₹ 8.90', seq: 'coffeebag6' },
  { name: 'Kintamani', description: 'Dark roast, spicy, 250g', price: '₹ 8.40', seq: 'coffeebag7' },
]

export default function ProductsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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
      className="py-16 px-4 max-w-7xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-12"
        variants={itemVariants}
      >
        <motion.div 
          className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <i className="ri-cup-line text-primary text-xl"></i>
        </motion.div>
        <motion.h2 
          className="text-3xl font-bold text-gray-900"
          variants={itemVariants}
        >
          Roasted goodness to your doorstep!
        </motion.h2>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {products.map((product, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="p-6">
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={`https://readdy.ai/api/search-image?query=A%20kraft%20paper%20coffee%20bag%20packaging%20with%20minimalist%20design%2C%20professional%20product%20photography%20on%20white%20background%2C%20commercial%20quality%2C%20perfect%20for%20e-commerce&width=300&height=400&seq=${product.seq}&orientation=portrait`}
                  alt="Coffee Bag"
                  width={300}
                  height={400}
                  className="h-48 object-contain"
                />
              </motion.div>
              <motion.div 
                className="flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <div>
                  <motion.h3 
                    className="font-bold text-gray-900"
                    whileHover={{ color: "#8000FF" }}
                    transition={{ duration: 0.2 }}
                  >
                    {product.name}
                  </motion.h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
                <motion.span 
                  className="font-bold text-gray-900"
                  whileHover={{ scale: 1.1, color: "#8000FF" }}
                  transition={{ duration: 0.2 }}
                >
                  {product.price}
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
