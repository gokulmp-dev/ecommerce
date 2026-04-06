import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-yellow-400">🛒 MyShop</Link>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-yellow-400 transition">Home</Link>

        {/* Cart with badge */}
        <Link to="/cart" className="hover:text-yellow-400 transition relative">
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-4 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        {user ? (
          <div className="relative">
            {/* User dropdown */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-yellow-400 font-semibold hover:text-yellow-300 transition"
            >
              👤 {user.name} ▾
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-xl shadow-lg z-50">
                <Link
                  to="/orders"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-100 rounded-t-xl text-sm font-semibold"
                >
                  📦 My Orders
                </Link>
                <hr />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-b-xl text-sm font-semibold text-red-500"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar