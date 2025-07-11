'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: number
  orderNumber: string
}

export default function FeedbackModal({ isOpen, onClose, orderId, orderNumber }: FeedbackModalProps) {
  const [ratings, setRatings] = useState({
    food_quality_rating: 0,
    service_speed_rating: 0,
    value_rating: 0,
    overall_rating: 0
  })
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRatingChange = (category: string, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          ...ratings,
          comments
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
          setSubmitted(false)
          setRatings({
            food_quality_rating: 0,
            service_speed_rating: 0,
            value_rating: 0,
            overall_rating: 0
          })
          setComments('')
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const StarRating = ({ rating, onChange, label }: { rating: number, onChange: (rating: number) => void, label: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            <i className="ri-star-fill text-xl"></i>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Rate Your Experience</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <p className="text-gray-600 mb-6">Order #{orderNumber}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <StarRating
                    rating={ratings.food_quality_rating}
                    onChange={(rating) => handleRatingChange('food_quality_rating', rating)}
                    label="Food/Drink Quality"
                  />

                  <StarRating
                    rating={ratings.service_speed_rating}
                    onChange={(rating) => handleRatingChange('service_speed_rating', rating)}
                    label="Service Speed"
                  />

                  <StarRating
                    rating={ratings.value_rating}
                    onChange={(rating) => handleRatingChange('value_rating', rating)}
                    label="Value for Money"
                  />

                  <StarRating
                    rating={ratings.overall_rating}
                    onChange={(rating) => handleRatingChange('overall_rating', rating)}
                    label="Overall Experience"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full p-3 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      rows={3}
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-2 border border-gray-300 rounded-button hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || Object.values(ratings).some(r => r === 0)}
                      className="flex-1 py-2 bg-primary text-white rounded-button hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-green-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you for your feedback!</h3>
                <p className="text-gray-600">Your review helps us improve our service.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
