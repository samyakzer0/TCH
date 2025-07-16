'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Order, MenuItem, OrderStats } from '../types'

interface AdminDashboardProps {
  user: any
  onLogout: () => void
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<{[category: string]: MenuItem[]}>({})
  const [analytics, setAnalytics] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_available: true
  })

  useEffect(() => {
    fetchOrders()
    fetchMenuItems()
    fetchAnalytics()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu?admin=true')
      const data = await response.json()
      if (data.success) {
        setMenuItems(data.data)
      }
    } catch (error) {
      console.error('Error fetching menu items:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      const data = await response.json()
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        // Get the updated order details
        const updatedOrder = orders.find(order => order.id === orderId)
        
        if (updatedOrder) {
          // Send notification about status change
          try {
            await fetch('/api/notifications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'status_update',
                email: true,
                phone: true,
                orderDetails: {
                  ...updatedOrder,
                  status: status
                },
                customerInfo: {
                  name: updatedOrder.customer_name,
                  email: updatedOrder.customer_email || 'customer@example.com',
                  phone: updatedOrder.customer_phone
                },
                status: status
              })
            })
            
            // Show success message
            alert(`Order #${updatedOrder.order_number} status updated to ${status}. Customer has been notified.`)
          } catch (notificationError) {
            console.error('Error sending notification:', notificationError)
            alert(`Order status updated, but notification failed to send.`)
          }
        }
        
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const toggleItemAvailability = async (itemId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !currentStatus })
      })

      if (response.ok) {
        fetchMenuItems()
        alert(`Item ${!currentStatus ? 'enabled' : 'disabled'} successfully`)
      }
    } catch (error) {
      console.error('Error updating item availability:', error)
    }
  }

  const openMenuModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item)
      setMenuForm({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        image_url: item.image_url,
        is_available: item.is_available
      })
    } else {
      setEditingItem(null)
      setMenuForm({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        is_available: true
      })
    }
    setShowMenuModal(true)
  }

  const saveMenuItem = async () => {
    try {
      const itemData = {
        name: menuForm.name,
        description: menuForm.description,
        price: parseFloat(menuForm.price),
        category: menuForm.category,
        image_url: menuForm.image_url,
        is_available: menuForm.is_available
      }

      const response = await fetch(editingItem ? `/api/menu/${editingItem.id}` : '/api/menu', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      })

      if (response.ok) {
        fetchMenuItems()
        setShowMenuModal(false)
        alert(`Item ${editingItem ? 'updated' : 'created'} successfully`)
      }
    } catch (error) {
      console.error('Error saving menu item:', error)
    }
  }

  const deleteMenuItem = async (itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/menu/${itemId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          fetchMenuItems()
          alert('Item deleted successfully')
        }
      } catch (error) {
        console.error('Error deleting menu item:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
  }

  const getTabDisplayName = (tabKey: string) => {
    const tabs = {
      orders: 'Orders Management',
      menu: 'Menu Management', 
      analytics: 'Analytics & Reports'
    }
    return tabs[tabKey as keyof typeof tabs] || 'Dashboard'
  }

  const getTabIcon = (tabKey: string) => {
    const icons = {
      orders: 'ri-file-list-3-line',
      menu: 'ri-restaurant-line',
      analytics: 'ri-bar-chart-line'
    }
    return icons[tabKey as keyof typeof icons] || 'ri-dashboard-line'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary font-pacifico">TCH Admin</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-gray-300">|</span>
                <i className={getTabIcon(activeTab)}></i>
                <span className="font-medium">{getTabDisplayName(activeTab)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-button hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {[
            { key: 'orders', label: 'Orders', icon: 'ri-file-list-3-line' },
            { key: 'menu', label: 'Menu', icon: 'ri-restaurant-line' },
            { key: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-button font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
              <div className="flex gap-2">
                <button
                  onClick={fetchOrders}
                  className="bg-primary text-white px-4 py-2 rounded-button hover:bg-primary/90 transition-colors"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Refresh
                </button>
              </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'received').length}</div>
                <div className="text-sm text-gray-600">New Orders</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'preparing').length}</div>
                <div className="text-sm text-gray-600">Preparing</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'ready').length}</div>
                <div className="text-sm text-gray-600">Ready</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-600">{orders.filter(o => o.status === 'completed').length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                          <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{order.customer_phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{order.order_type}</div>
                          {order.table_number && (
                            <div className="text-sm text-gray-500">Table {order.table_number}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-button ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            {order.status === 'received' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                className="bg-yellow-600 text-white px-3 py-1 rounded-button hover:bg-yellow-700 transition-colors"
                              >
                                Start Preparing
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="bg-green-600 text-white px-3 py-1 rounded-button hover:bg-green-700 transition-colors"
                              >
                                Mark Ready
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="bg-gray-600 text-white px-3 py-1 rounded-button hover:bg-gray-700 transition-colors"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
              <button
                onClick={() => openMenuModal()}
                className="bg-primary text-white px-4 py-2 rounded-button hover:bg-primary/90 transition-colors"
              >
                <i className="ri-add-line mr-2"></i>
                Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(menuItems).map(([category, items]) => (
                <div key={category} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-button">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                          <p className="text-sm font-semibold text-primary">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <button 
                            onClick={() => toggleItemAvailability(item.id, item.is_available)}
                            className={`text-xs px-2 py-1 rounded ${item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {item.is_available ? 'In Stock' : 'Out of Stock'}
                          </button>
                          <button
                            onClick={() => openMenuModal(item)}
                            className="text-gray-400 hover:text-primary"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Menu Item Modal */}
            {showMenuModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                    </h3>
                    <button
                      onClick={() => setShowMenuModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={menuForm.name}
                        onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                        className="w-full p-3 border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter item name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={menuForm.description}
                        onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                        className="w-full p-3 border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter item description"
                        rows={3}
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price *
                        </label>
                        <input
                          type="number"
                          value={menuForm.price}
                          onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                          className="w-full p-3 border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter item price"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <input
                          type="text"
                          value={menuForm.category}
                          onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                          className="w-full p-3 border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter item category"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={menuForm.image_url}
                        onChange={(e) => setMenuForm({...menuForm, image_url: e.target.value})}
                        className="w-full p-3 border rounded-button focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter image URL"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={menuForm.is_available}
                        onChange={(e) => setMenuForm({...menuForm, is_available: e.target.checked})}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Available for order
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => setShowMenuModal(false)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-button hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveMenuItem}
                        className="bg-primary text-white px-4 py-2 rounded-button hover:bg-primary/90 transition-colors"
                      >
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
              <div className="flex gap-2">
                <button
                  onClick={fetchAnalytics}
                  className="bg-primary text-white px-4 py-2 rounded-button hover:bg-primary/90 transition-colors"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Refresh
                </button>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{analytics.total_orders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{analytics.total_revenue.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary">{analytics.total_customers}</div>
                <div className="text-sm text-gray-600">Total Customers</div>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders This Month</h3>
              <div className="h-64">
                {/* Replace with your chart component */}
                <div className="animate-pulse h-full bg-gray-100 rounded-lg"></div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue This Month</h3>
              <div className="h-64">
                {/* Replace with your chart component */}
                <div className="animate-pulse h-full bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
