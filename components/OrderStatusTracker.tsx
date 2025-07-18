'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FeedbackModal from './FeedbackModal'

export default function OrderStatusTracker() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searchType, setSearchType] = useState<'order_number' | 'phone'>('order_number')
  const [order, setOrder] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const trackOrder = async () => {
    const searchValue = searchType === 'order_number' ? orderNumber.trim() : phoneNumber.trim()
    if (!searchValue) return
    
    setLoading(true)
    setError('')
    setOrder(null)
    setOrders([])
    
    try {
      const searchParam = searchType === 'order_number' ? 'order_number' : 'phone'
      const response = await fetch(`/api/orders?${searchParam}=${searchValue}`)
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        if (searchType === 'order_number') {
          setOrder(data.data[0])
        } else {
          // For phone search, show all orders for that phone number
          setOrders(data.data)
          if (data.data.length === 1) {
            setOrder(data.data[0])
          }
        }
      } else {
        const searchLabel = searchType === 'order_number' ? 'order number' : 'phone number'
        setError(`No orders found for this ${searchLabel}. Please check and try again.`)
      }
    } catch (error) {
      setError('Failed to fetch order details.')
    } finally {
      setLoading(false)
    }
  }

  const selectOrder = (selectedOrder: any) => {
    setOrder(selectedOrder)
    setOrders([])
  }

  const goBackToList = () => {
    setOrder(null)
    // Re-search to show all orders for the phone number
    if (searchType === 'phone' && phoneNumber.trim()) {
      trackOrder()
    }
  }

  const clearSearch = () => {
    setOrderNumber('')
    setPhoneNumber('')
    setOrder(null)
    setOrders([])
    setError('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      trackOrder()
    }
  }

  const getStatusSteps = () => {
    const steps = [
      { key: 'received', label: 'Order Received', icon: 'ri-check-line' },
      { key: 'preparing', label: 'Preparing', icon: 'ri-restaurant-line' },
      { key: 'ready', label: 'Ready', icon: 'ri-notification-line' },
      { key: 'completed', label: 'Completed', icon: 'ri-checkbox-circle-line' }
    ]

    if (order?.status === 'cancelled') {
      return [
        { key: 'cancelled', label: 'Cancelled', icon: 'ri-close-circle-line' }
      ]
    }

    return steps
  }

  const getCurrentStepIndex = () => {
    const steps = ['received', 'preparing', 'ready', 'completed']
    return steps.indexOf(order?.status || 'received')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'text-blue-600'
      case 'preparing': return 'text-yellow-600'
      case 'ready': return 'text-green-600'
      case 'completed': return 'text-gray-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-400'
    }
  }

  const canCancel = () => {
    return order && ['received', 'preparing'].includes(order.status)
  }

  const canProvideFeedback = () => {
    return order && order.status === 'completed'
  }

  const handleCancel = async () => {
    if (!order || !window.confirm('Are you sure you want to cancel this order?')) return

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setOrder({ ...order, status: 'cancelled' })
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h2>
        
        {/* Search Type Selection */}
        <div className="mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearchType('order_number')
                setError('')
                setOrder(null)
                setOrders([])
              }}
              className={`flex-1 py-2 px-4 rounded-button font-medium transition-colors ${
                searchType === 'order_number'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="ri-file-list-line mr-2"></i>
              Order Number
            </button>
            <button
              onClick={() => {
                setSearchType('phone')
                setError('')
                setOrder(null)
                setOrders([])
              }}
              className={`flex-1 py-2 px-4 rounded-button font-medium transition-colors ${
                searchType === 'phone'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="ri-phone-line mr-2"></i>
              Phone Number
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {searchType === 'order_number' 
              ? 'Search for a specific order using your order number'
              : 'Search for all orders associated with your phone number'
            }
          </p>
        </div>

        {/* Search Input */}
        <div className="flex gap-3 mb-6">
          {searchType === 'order_number' ? (
            <input
              type="text"
              placeholder="Enter your order number (e.g., TCH-1234567890-ABCD)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          ) : (
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          )}
          <button
            onClick={trackOrder}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-button hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
          {(orderNumber || phoneNumber || order || orders.length > 0) && (
            <button
              onClick={clearSearch}
              className="px-4 py-3 border border-gray-300 rounded-button hover:bg-gray-50 transition-colors"
              title="Clear search"
            >
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-button p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Multiple Orders List (when searching by phone) */}
        {orders.length > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Found {orders.length} orders for this phone number:
            </h3>
            <div className="space-y-3">
              {orders.map((orderItem, index) => (
                <div
                  key={index}
                  onClick={() => selectOrder(orderItem)}
                  className="p-4 border rounded-button hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Order #{orderItem.order_number}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(orderItem.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">${orderItem.total_amount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        orderItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                        orderItem.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                        orderItem.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        orderItem.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {orderItem.status.charAt(0).toUpperCase() + orderItem.status.slice(1)}
                      </span>
                      <i className="ri-arrow-right-s-line text-gray-400"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Back Button (only show when there were multiple orders) */}
            {searchType === 'phone' && orders.length === 0 && (
              <button
                onClick={goBackToList}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <i className="ri-arrow-left-line"></i>
                Back to all orders
              </button>
            )}

            {/* Order Details */}
            <div className="bg-gray-50 rounded-button p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                  <p className="text-sm text-gray-600">Order: {order.order_number}</p>
                  <p className="text-sm text-gray-600">Type: {order.order_type}</p>
                  {order.table_number && (
                    <p className="text-sm text-gray-600">Table: {order.table_number}</p>
                  )}
                  <p className="text-sm text-gray-600">Total: ${order.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Info</h3>
                  <p className="text-sm text-gray-600">{order.customer_name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{order.customer_phone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    Placed: {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Order Status</h3>
              
              {order.status === 'cancelled' ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-button">
                  <i className="ri-close-circle-line text-red-600 text-xl"></i>
                  <span className="font-medium text-red-600">Order Cancelled</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {getStatusSteps().map((step, index) => {
                    const currentIndex = getCurrentStepIndex()
                    const isActive = index <= currentIndex
                    const isCurrent = index === currentIndex

                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-button transition-colors ${
                          isActive ? 'bg-primary/10' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <i className={`${step.icon} text-sm`}></i>
                        </div>
                        <span className={`font-medium ${
                          isActive ? 'text-primary' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {order.estimated_completion_time && (
                <div className="bg-blue-50 border border-blue-200 rounded-button p-3">
                  <p className="text-sm text-blue-600">
                    <i className="ri-time-line mr-2"></i>
                    Estimated completion: {new Date(order.estimated_completion_time).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Order Items</h3>
              <div className="space-y-2">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-button">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.menu_item?.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.customizations && (
                        <p className="text-xs text-gray-500">
                          {JSON.parse(item.customizations).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            {order.special_instructions && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-button p-3">
                <h4 className="font-medium text-yellow-800 mb-1">Special Instructions</h4>
                <p className="text-sm text-yellow-700">{order.special_instructions}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {canCancel() && (
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red-600 text-white py-2 rounded-button hover:bg-red-700 transition-colors"
                >
                  Cancel Order
                </button>
              )}
              {canProvideFeedback() && (
                <button
                  onClick={() => setShowFeedback(true)}
                  className="flex-1 bg-primary text-white py-2 rounded-button hover:bg-primary/90 transition-colors"
                >
                  Leave Feedback
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedback && order && (
        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          orderId={order.id}
          orderNumber={order.order_number}
        />
      )}
    </div>
  )
}
