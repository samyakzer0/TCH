'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export default function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          onDismiss(notification.id)
        }, notification.duration)
        
        return () => clearTimeout(timer)
      }
    })
  }, [notifications, onDismiss])

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'ri-check-circle-line text-green-600'
      case 'info':
        return 'ri-information-line text-blue-600'
      case 'warning':
        return 'ri-alert-line text-yellow-600'
      case 'error':
        return 'ri-error-warning-line text-red-600'
      default:
        return 'ri-notification-line text-gray-600'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`border rounded-lg p-4 shadow-lg ${getNotificationStyles(notification.type)}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className={`${getNotificationIcon(notification.type)} text-xl`}></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="font-semibold text-sm">{notification.title}</div>
                <div className="text-sm mt-1">{notification.message}</div>
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-sm font-medium underline hover:no-underline"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => onDismiss(notification.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Predefined notification types
  const showSuccess = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'success', title, message, duration })
  }

  const showInfo = (title: string, message: string, duration = 5000) => {
    addNotification({ type: 'info', title, message, duration })
  }

  const showWarning = (title: string, message: string, duration = 7000) => {
    addNotification({ type: 'warning', title, message, duration })
  }

  const showError = (title: string, message: string, duration = 10000) => {
    addNotification({ type: 'error', title, message, duration })
  }

  // Order-specific notifications
  const showOrderPlaced = (orderNumber: string) => {
    addNotification({
      type: 'success',
      title: 'Order Placed Successfully!',
      message: `Your order #${orderNumber} has been received and is being prepared.`,
      duration: 8000,
      action: {
        label: 'Track Order',
        onClick: () => window.location.href = '/track'
      }
    })
  }

  const showOrderStatusUpdate = (orderNumber: string, status: string, estimatedTime?: string) => {
    const statusMessages = {
      preparing: 'Your order is now being prepared',
      ready: 'Your order is ready for pickup/serving',
      completed: 'Your order has been completed',
      cancelled: 'Your order has been cancelled'
    }

    const message = statusMessages[status as keyof typeof statusMessages] || `Order status updated to: ${status}`
    
    addNotification({
      type: status === 'cancelled' ? 'error' : status === 'completed' ? 'success' : 'info',
      title: `Order #${orderNumber} Update`,
      message: estimatedTime ? `${message}. ${estimatedTime}` : message,
      duration: status === 'ready' ? 0 : 8000, // Keep ready notification until dismissed
      action: {
        label: 'View Details',
        onClick: () => window.location.href = '/track'
      }
    })
  }

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    showSuccess,
    showInfo,
    showWarning,
    showError,
    showOrderPlaced,
    showOrderStatusUpdate
  }
}
