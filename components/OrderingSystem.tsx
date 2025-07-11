'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuItem, CartItem } from '../types'
import FeedbackModal from './FeedbackModal'
import DigitalReceipt from './DigitalReceipt'
import NotificationSystem, { useNotifications } from './NotificationSystem'

interface OrderingSystemProps {}

export default function OrderingSystem({}: OrderingSystemProps) {
  const [menuItems, setMenuItems] = useState<{[category: string]: MenuItem[]}>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showCart, setShowCart] = useState(false)
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    table_number: ''
  })
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [showCustomizations, setShowCustomizations] = useState<{item: MenuItem, show: boolean}>({item: {} as MenuItem, show: false})
  const [currentCustomizations, setCurrentCustomizations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showDigitalReceipt, setShowDigitalReceipt] = useState(false)
  const { notifications, dismissNotification, showOrderPlaced, showSuccess, showError } = useNotifications()

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu')
      const data = await response.json()
      if (data.success) {
        setMenuItems(data.data)
        const categories = Object.keys(data.data)
        if (categories.length > 0) {
          setSelectedCategory(categories[0])
        }
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCustomizationOptions = (item: MenuItem) => {
    const options: string[] = []
    
    if (item.category === 'Hot Teas' || item.category === 'Cold Beverages') {
      options.push('Extra Strong', 'Less Sugar', 'Extra Sugar', 'Less Milk', 'Extra Milk', 'Decaf')
    }
    
    if (item.category === 'Snacks') {
      options.push('Mild Spice', 'Medium Spice', 'Extra Spicy', 'No Onions', 'Extra Sauce')
    }
    
    return options
  }

  const addToCart = (item: MenuItem, customizations: string[] = []) => {
    const existingItem = cart.find(cartItem => 
      cartItem.menu_item.id === item.id && 
      JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
    )
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.menu_item.id === item.id && 
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { menu_item: item, quantity: 1, customizations }])
    }
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(index)
    } else {
      setCart(cart.map((item, i) => i === index ? { ...item, quantity: newQuantity } : item))
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.menu_item.price * item.quantity), 0)
  }

  const handleCustomizationAdd = (item: MenuItem) => {
    setShowCustomizations({item, show: true})
    setCurrentCustomizations([])
  }

  const confirmCustomizations = () => {
    addToCart(showCustomizations.item, currentCustomizations)
    setShowCustomizations({item: {} as MenuItem, show: false})
    setCurrentCustomizations([])
  }

  const placeOrder = async () => {
    if (cart.length === 0) return

    const orderData = {
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_email: customerInfo.email,
      order_type: orderType,
      table_number: orderType === 'dine-in' ? customerInfo.table_number : undefined,
      items: cart.map(item => ({
        menu_item_id: item.menu_item.id,
        name: item.menu_item.name,
        quantity: item.quantity,
        price: item.menu_item.price,
        customizations: item.customizations
      })),
      special_instructions: specialInstructions
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()
      if (data.success) {
        setOrderDetails(data.data)
        setOrderComplete(true)
        setShowDigitalReceipt(true)
        setCart([])
        setCustomerInfo({ name: '', phone: '', email: '', table_number: '' })
        setSpecialInstructions('')
        
        // Show success notification
        showOrderPlaced(data.data.order_number)
        
        // Send confirmation notification to customer
        try {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'order_confirmation',
              email: true,
              phone: true,
              orderDetails: data.data,
              customerInfo: customerInfo
            })
          })
        } catch (notificationError) {
          console.error('Error sending confirmation notification:', notificationError)
        }
      } else {
        showError('Order Failed', data.error || 'Unable to place order. Please try again.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      showError('Order Failed', 'Unable to place order. Please try again.')
    }
  }

  const sendOrderNotification = async (orderNumber: string, status: string, customerInfo: any) => {
    try {
      const statusMessages = {
        received: 'Your order has been received and is being processed.',
        preparing: 'Your order is now being prepared by our team.',
        ready: 'Your order is ready for pickup/serving!',
        completed: 'Your order has been completed. Thank you for choosing The Chai House!',
        cancelled: 'Your order has been cancelled.'
      }

      if (customerInfo.phone) {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'sms',
            recipient: customerInfo.phone,
            orderNumber,
            status,
            message: statusMessages[status as keyof typeof statusMessages],
            customerName: customerInfo.name
          })
        })
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const handleSendReceipt = async (method: 'email' | 'sms') => {
    try {
      const recipient = method === 'email' ? customerInfo.email : customerInfo.phone
      if (!recipient) {
        showError('Missing Information', `Please provide your ${method} to receive the receipt.`)
        return
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: method,
          recipient,
          orderNumber: orderDetails.order_number,
          status: 'receipt',
          message: 'Here is your order receipt from The Chai House.',
          customerName: customerInfo.name
        })
      })

      const data = await response.json()
      if (data.success) {
        showSuccess('Receipt Sent', `Receipt has been sent to your ${method}.`)
      } else {
        showError('Send Failed', `Unable to send receipt via ${method}. Please try again.`)
      }
    } catch (error) {
      console.error('Error sending receipt:', error)
      showError('Send Failed', `Unable to send receipt via ${method}. Please try again.`)
    }
  }

  const startNewOrder = () => {
    setOrderComplete(false)
    setOrderDetails(null)
    setShowFeedback(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-green-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Your order has been received and is being prepared.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Order Number:</span>
              <span className="text-primary font-bold">{orderDetails?.order_number}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-bold">${orderDetails?.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Estimated Time:</span>
              <span>{orderDetails?.estimated_time}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startNewOrder}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-primary/90 transition-colors"
            >
              Place Another Order
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-button font-medium hover:bg-gray-700 transition-colors"
            >
              Leave Feedback
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Menu</h2>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(menuItems).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-button font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems[selectedCategory]?.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-primary text-white py-2 rounded-button font-medium hover:bg-primary/90 transition-colors"
                    >
                      Add to Cart
                    </button>
                    {getCustomizationOptions(item).length > 0 && (
                      <button
                        onClick={() => handleCustomizationAdd(item)}
                        className="px-3 py-2 border border-primary text-primary rounded-button hover:bg-primary/5 transition-colors"
                      >
                        <i className="ri-settings-line"></i>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Order</h3>
            
            {/* Order Type Selection */}
            <div className="mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderType('dine-in')}
                  className={`flex-1 py-2 rounded-button font-medium transition-colors ${
                    orderType === 'dine-in'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dine In
                </button>
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`flex-1 py-2 rounded-button font-medium transition-colors ${
                    orderType === 'takeaway'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Takeaway
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full p-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="w-full p-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                className="w-full p-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {orderType === 'dine-in' && (
                <input
                  type="text"
                  placeholder="Table Number"
                  value={customerInfo.table_number}
                  onChange={(e) => setCustomerInfo({...customerInfo, table_number: e.target.value})}
                  className="w-full p-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              )}
            </div>

            {/* Cart Items */}
            <div className="mb-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-button">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.menu_item.name}</h4>
                        {item.customizations.length > 0 && (
                          <p className="text-xs text-gray-600">{item.customizations.join(', ')}</p>
                        )}
                        <p className="text-sm text-gray-600">${item.menu_item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <i className="ri-subtract-line"></i>
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="mb-4">
              <textarea
                placeholder="Special instructions (optional)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full p-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
              />
            </div>

            {/* Total and Checkout */}
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">${getTotalAmount().toFixed(2)}</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.email || (orderType === 'dine-in' && !customerInfo.table_number)}
                  className="w-full bg-primary text-white py-3 rounded-button font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      <AnimatePresence>
        {showCustomizations.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCustomizations({item: {} as MenuItem, show: false})}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Customize {showCustomizations.item.name}</h3>
              
              <div className="space-y-2 mb-6">
                {getCustomizationOptions(showCustomizations.item).map(option => (
                  <label key={option} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={currentCustomizations.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCurrentCustomizations([...currentCustomizations, option])
                        } else {
                          setCurrentCustomizations(currentCustomizations.filter(c => c !== option))
                        }
                      }}
                      className="w-5 h-5 text-primary"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCustomizations({item: {} as MenuItem, show: false})}
                  className="flex-1 py-2 border border-gray-300 rounded-button hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCustomizations}
                  className="flex-1 py-2 bg-primary text-white rounded-button hover:bg-primary/90 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      {showFeedback && orderDetails && (
        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          orderId={orderDetails.order_id}
          orderNumber={orderDetails.order_number}
        />
      )}
    </div>
  )
}
