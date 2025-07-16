'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const coffeeItems = [
  {
    name: 'Classic Silk',
    description: 'A rich, full-bodied and silky coffee made smooth to perfection',
    price: '₹12.99',
    image: 'coffee1'
  },
  {
    name: 'Irish Vibes',
    description: 'A coffee inspired drink with real butter in a creamy base',
    price: '₹5.99',
    image: 'coffee2'
  },
  {
    name: 'Choco Wave',
    description: 'Espresso with a swirl of chocolate milk foam for a balanced taste',
    price: '$10.99',
    image: 'coffee3'
  },
  {
    name: 'Cold War',
    description: 'Espresso topped with equal parts steamed milk and fluffy cream',
    price: '$5.99',
    image: 'coffee4'
  },
  {
    name: 'Late Night',
    description: 'Freshly roasted high-brew coffee with rich aroma',
    price: '$14.99',
    image: 'coffee5'
  },
  {
    name: 'Frappe Latte',
    description: 'A delightful ice & sweetener, cinnamon, rich and aromatic',
    price: '$4.99',
    image: 'coffee6'
  },
  {
    name: 'Cool Brew',
    description: 'Slow-brewed coffee highlighting intricate flavors and aroma',
    price: '$16.99',
    image: 'coffee7'
  },
  {
    name: 'North Pole',
    description: 'A cool, iced slow-drip coffee dense chilled to a matching experience',
    price: '$14.99',
    image: 'coffee8'
  }
]

const foodItems = [
  {
    name: 'Mon Salad',
    description: 'A fresh medley of greens and seasonal vegetables with a zesty dressing',
    price: '$18.99',
    image: 'food1'
  },
  {
    name: 'Lamb Soup',
    description: 'Hearty and nourishing soup made with lean lamb ingredients',
    price: '$18.00',
    image: 'food2'
  },
  {
    name: 'Cabbage Pot Salad',
    description: 'Crisp cabbage mixed with country fresh and crispy seasonings',
    price: '$24.00',
    image: 'food3'
  },
  {
    name: 'Cracked N Cheese',
    description: 'A delightful combo of gourmet cheese and artisanal crackers',
    price: '$10.99',
    image: 'food4'
  },
  {
    name: 'Sushi Bits',
    description: 'Bite-sized sushi rolls fresh rice and ocean flavors',
    price: '$4.99',
    image: 'food5'
  },
  {
    name: 'House Fries',
    description: 'Crispy golden fries seasoned with our special herb mix',
    price: '$13.99',
    image: 'food6'
  },
  {
    name: 'Dostitos Berry',
    description: 'A crunchy treat combining the sweetness of seasonal berries',
    price: '$15.99',
    image: 'food7'
  },
  {
    name: 'Mango Sweat',
    description: 'Refreshing blend mixed with fresh mango and a citrus dressing',
    price: '$13.00',
    image: 'food8'
  }
]

export default function MenuPage() {
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
    <main className="bg-[#F5F6FC] min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="relative pt-24 pb-8 overflow-hidden px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="bg-primary w-full h-[50vh] flex items-center relative rounded-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Text Section */}
            <div className="relative z-10 text-left px-8 lg:px-12">
              <motion.h1 
                className="text-white text-6xl md:text-8xl font-black tracking-wider leading-tight"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                MENU
              </motion.h1>
            </div>

            {/* Pizza Image Section - Half visible, bottom-right */}
            <motion.div 
              className="absolute bottom-0 right-0 overflow-hidden"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 100, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Image
                src="/images/menu.png"
                alt="Menu Item"
                width={400}
                height={600}
                className="w-auto h-[300px] md:h-[400px] object-contain"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Coffee Section */}
      <motion.section 
        className="py-16 px-4 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Coffee</h2>
          <p className="text-gray-600">We brew something for everyone</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {coffeeItems.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={`https://readdy.ai/api/search-image?query=Professional%20coffee%20drink%20in%20a%20cup%2C%20top%20view%2C%20commercial%20photography%20for%20menu&width=200&height=200&seq=${item.image}&orientation=square`}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex-grow">
                <motion.h3 
                  className="font-bold text-gray-900 text-lg mb-1"
                  whileHover={{ color: "#8000FF" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
              <motion.div 
                className="font-bold text-gray-900 text-lg"
                whileHover={{ scale: 1.1, color: "#8000FF" }}
                transition={{ duration: 0.2 }}
              >
                {item.price}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Food Section */}
      <motion.section 
        className="py-16 px-4 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Food</h2>
          <p className="text-gray-600">Deliciously satisfying dishes</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {foodItems.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={`https://readdy.ai/api/search-image?query=Professional%20food%20dish%20photography%2C%20appetizing%20meal%20presentation%2C%20commercial%20quality%20for%20restaurant%20menu&width=200&height=200&seq=${item.image}&orientation=square`}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex-grow">
                <motion.h3 
                  className="font-bold text-gray-900 text-lg mb-1"
                  whileHover={{ color: "#8000FF" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
              <motion.div 
                className="font-bold text-gray-900 text-lg"
                whileHover={{ scale: 1.1, color: "#8000FF" }}
                transition={{ duration: 0.2 }}
              >
                {item.price}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <Footer />
    </main>
  )
}
