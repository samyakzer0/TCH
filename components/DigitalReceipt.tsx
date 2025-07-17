'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

interface DigitalReceiptProps {
  orderDetails: any
  customerInfo: any
  cart: any[]
  orderType: string
  specialInstructions: string
  onClose: () => void
  onSendReceipt?: (method: 'email' | 'sms') => void
}

export default function DigitalReceipt({ 
  orderDetails, 
  customerInfo, 
  cart, 
  orderType, 
  specialInstructions,
  onClose,
  onSendReceipt 
}: DigitalReceiptProps) {
  const [showSendOptions, setShowSendOptions] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TCH Order Receipt',
        text: `Order #${orderDetails.order_number} - ₹${orderDetails.total_amount.toFixed(2)}`,
        url: window.location.href
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Order #${orderDetails.order_number} - Total: ₹${orderDetails.total_amount.toFixed(2)} - Track at: ${window.location.origin}/track`
      )
      alert('Order details copied to clipboard!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-primary text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/images/gallery/logo.png"
                alt="The Chai House Logo"
                width={32}
                height={32}
                className="object-contain filter brightness-0 invert"
              />
              <div>
                <h2 className="text-2xl font-bold font-pacifico">The Chai House</h2>
                <p className="text-primary-light text-sm">Order Confirmation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600">We've received your order and will start preparing it shortly.</p>
          </div>

          {/* Order Details */}
          <div className="border-t border-b py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order Number:</span>
                <div className="font-bold text-primary text-lg">{orderDetails.order_number}</div>
              </div>
              <div>
                <span className="text-gray-600">Date & Time:</span>
                <div className="font-medium">{formatDate(new Date().toISOString())}</div>
              </div>
              <div>
                <span className="text-gray-600">Order Type:</span>
                <div className="font-medium capitalize">{orderType}</div>
              </div>
              <div>
                <span className="text-gray-600">Customer:</span>
                <div className="font-medium">{customerInfo.name}</div>
              </div>
              {orderType === 'dine-in' && customerInfo.table_number && (
                <div>
                  <span className="text-gray-600">Table Number:</span>
                  <div className="font-medium">{customerInfo.table_number}</div>
                </div>
              )}
              <div>
                <span className="text-gray-600">Phone:</span>
                <div className="font-medium">{customerInfo.phone}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">{item.menu_item.name}</div>
                    {item.customizations.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        {item.customizations.join(', ')}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      ₹{item.menu_item.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">
                    ₹{(item.menu_item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {specialInstructions && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                {specialInstructions}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">₹{orderDetails.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center text-blue-800">
              <i className="ri-time-line text-xl mr-2"></i>
              <div>
                <div className="font-semibold">Estimated Preparation Time</div>
                <div className="text-sm">{orderDetails.estimated_time || '15-20 minutes'}</div>
              </div>
            </div>
          </div>

          {/* Order Status Tracking */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Track Your Order</div>
                <div className="text-sm text-gray-600">Use order number to check status</div>
              </div>
              <a
                href="/track"
                className="bg-primary text-white px-4 py-2 rounded-button text-sm hover:bg-primary/90 transition-colors"
              >
                Track Order
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-button hover:bg-gray-700 transition-colors"
            >
              <i className="ri-printer-line"></i>
              Print
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-button hover:bg-blue-700 transition-colors"
            >
              <i className="ri-share-line"></i>
              Share
            </button>
          </div>

          {/* Send Receipt Options */}
          <div className="text-center">
            <button
              onClick={() => setShowSendOptions(!showSendOptions)}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              <i className="ri-mail-line mr-1"></i>
              Send Receipt Copy
            </button>
            
            {showSendOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex gap-2 justify-center"
              >
                <button
                  onClick={() => onSendReceipt?.('email')}
                  className="px-4 py-2 bg-green-600 text-white rounded-button text-sm hover:bg-green-700 transition-colors"
                >
                  Email
                </button>
                <button
                  onClick={() => onSendReceipt?.('sms')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-button text-sm hover:bg-blue-700 transition-colors"
                >
                  SMS
                </button>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>Thank you for choosing The Chai House!</p>
            <p className="mt-1">Questions? Contact us at info@thechai.house</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
