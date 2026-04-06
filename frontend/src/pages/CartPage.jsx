import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty 🛒</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="flex flex-col gap-4">
        {cartItems.map(item => (
          <div key={item._id} className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-yellow-500 font-bold">${item.price}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item._id, item.qty - 1)}
                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
              >
                −
              </button>
              <span className="font-semibold w-6 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item._id, item.qty + 1)}
                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>

            {/* Item Total */}
            <p className="font-bold w-20 text-right">${(item.price * item.qty).toFixed(2)}</p>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 hover:text-red-700 font-bold text-xl transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between text-lg mb-4">
          <span>Total:</span>
          <span className="font-bold text-yellow-500">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="flex-1 border-2 border-gray-900 text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Clear Cart
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-yellow-500 transition font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage