import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL

const OrderHistoryPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        const data = await res.json()
        setOrders(data)
        setLoading(false)
      } catch { setLoading(false) }
    }
    fetchOrders()
  }, [user])

  if (loading) return <p className="text-center mt-10">Loading orders...</p>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-xl font-bold mb-4">No Orders Yet 📦</h2>
          <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-yellow-500 transition">Start Shopping</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <div><p className="text-xs text-gray-400">Order ID</p><p className="font-mono text-sm font-semibold">{order._id}</p></div>
                <div className="text-right"><p className="text-xs text-gray-400">Date</p><p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                <div className="text-right"><p className="text-xs text-gray-400">Total</p><p className="text-yellow-500 font-bold">₹{order.totalPrice.toFixed(2)}</p></div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Status</p>
                  {order.isCancelled ? (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Cancelled</span>
                  ) : order.isDelivered ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Delivered</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Processing</span>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mb-4 flex-wrap">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    <div><p className="text-xs font-semibold">{item.name}</p><p className="text-xs text-gray-500">Qty: {item.qty}</p></div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mb-4">📍 {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}</div>
              <button onClick={() => navigate(`/order/${order._id}`)} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 transition">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderHistoryPage