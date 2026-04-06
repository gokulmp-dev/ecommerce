import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL

const OrderPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [returnType, setReturnType] = useState('return')
  const [returnReason, setReturnReason] = useState('')
  const [submittingReturn, setSubmittingReturn] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
      const data = await res.json()
      setOrder(data)
      setLoading(false)
    } catch { setLoading(false) }
  }

  useEffect(() => { fetchOrder() }, [id])

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelling(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/cancel`, { method: 'PUT', headers: { Authorization: `Bearer ${user.token}` } })
      const data = await res.json()
      if (!res.ok) { setError(data.message) } else { setMessage('Order cancelled successfully.'); fetchOrder() }
    } catch { setError('Something went wrong.') }
    setCancelling(false)
  }

  const handleReturn = async () => {
    if (!returnReason.trim()) { setError('Please enter a reason.'); return }
    setSubmittingReturn(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ returnType, returnReason })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message) } else { setMessage(`${returnType === 'return' ? 'Return' : 'Replacement'} request submitted!`); setShowReturnForm(false); fetchOrder() }
    } catch { setError('Something went wrong.') }
    setSubmittingReturn(false)
  }

  const handleReview = async () => {
    if (!comment.trim()) { setError('Please enter a comment.'); return }
    setSubmittingReview(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ rating, comment })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message) } else { setMessage('Review submitted successfully!'); setShowReviewForm(false); fetchOrder() }
    } catch { setError('Something went wrong.') }
    setSubmittingReview(false)
  }

  if (loading) return <p className="text-center mt-10">Loading order...</p>
  if (!order) return <p className="text-center mt-10 text-red-500">Order not found.</p>

  const statusLabel = order.isCancelled ? 'Cancelled' : order.isDelivered ? 'Delivered' : 'Processing'
  const statusColor = order.isCancelled
    ? 'bg-red-100 text-red-700 border-red-400'
    : order.isDelivered
    ? 'bg-green-100 text-green-700 border-green-400'
    : 'bg-yellow-100 text-yellow-700 border-yellow-400'

  return (
    <div className="max-w-3xl mx-auto">
      <div className={`border px-6 py-4 rounded-xl mb-6 text-center ${statusColor}`}>
        <h1 className="text-2xl font-bold">
          {order.isCancelled ? '❌ Order Cancelled' : order.isDelivered ? '✅ Order Delivered' : '✅ Order Placed Successfully!'}
        </h1>
        <p className="text-sm mt-1">Order ID: {order._id}</p>
        <p className="text-sm font-semibold mt-1">Status: {statusLabel}</p>
      </div>

      {message && <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-4 text-center font-semibold">{message}</div>}
      {error && <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.isCancelled ? 'bg-red-100 text-red-700' : order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="flex flex-col gap-3">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                <div className="flex-1"><p className="font-semibold text-sm">{item.name}</p><p className="text-gray-500 text-xs">{item.qty} x ₹{item.price}</p></div>
                <p className="font-bold text-sm">₹{(item.qty * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg"><span>Total:</span><span className="text-yellow-500">₹{order.totalPrice.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          {!order.isCancelled && !order.isDelivered && (
            <button onClick={handleCancel} disabled={cancelling} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold">
              {cancelling ? 'Cancelling...' : '❌ Cancel Order'}
            </button>
          )}
          {order.isDelivered && !order.isCancelled && !order.returnRequested && (
            <button onClick={() => setShowReturnForm(!showReturnForm)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold">🔄 Return / Replace</button>
          )}
          {order.returnRequested && (
            <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              order.returnStatus === 'approved' ? 'bg-green-100 text-green-700'
              : order.returnStatus === 'rejected' ? 'bg-red-100 text-red-600'
              : 'bg-blue-100 text-blue-700'
            }`}>
              {order.returnType === 'replace' ? '🔄 Replacement' : '↩️ Return'} Request: {order.returnStatus.charAt(0).toUpperCase() + order.returnStatus.slice(1)}
            </span>
          )}
          {order.isDelivered && !order.isCancelled && (
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold">⭐ Write a Review</button>
          )}
        </div>

        {showReturnForm && (
          <div className="mt-4 border rounded-xl p-4 bg-gray-50">
            <h3 className="font-bold mb-3">Return / Replace Request</h3>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" value="return" checked={returnType === 'return'} onChange={() => setReturnType('return')} />↩️ Return</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" value="replace" checked={returnType === 'replace'} onChange={() => setReturnType('replace')} />🔄 Replace</label>
            </div>
            <textarea placeholder="Reason for return/replacement..." className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3" rows={3} value={returnReason} onChange={(e) => setReturnReason(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={handleReturn} disabled={submittingReturn} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold">{submittingReturn ? 'Submitting...' : 'Submit Request'}</button>
              <button onClick={() => setShowReturnForm(false)} className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition">Cancel</button>
            </div>
          </div>
        )}

        {showReviewForm && (
          <div className="mt-4 border rounded-xl p-4 bg-gray-50">
            <h3 className="font-bold mb-3">Write a Review</h3>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
              ))}
              <span className="text-sm text-gray-500 self-center ml-2">{rating}/5</span>
            </div>
            <textarea placeholder="Write your review here..." className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-3" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={handleReview} disabled={submittingReview} className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold">{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
              <button onClick={() => setShowReviewForm(false)} className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition">Cancel</button>
            </div>
          </div>
        )}

        {order.reviews && order.reviews.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold mb-3">Reviews</h3>
            <div className="flex flex-col gap-3">
              {order.reviews.map((review, index) => (
                <div key={index} className="border rounded-xl p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-yellow-400 text-sm mb-1">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={() => navigate('/')} className="mt-6 w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-yellow-500 transition font-semibold">Continue Shopping</button>
    </div>
  )
}

export default OrderPage