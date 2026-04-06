import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message) } else { login(data); navigate('/') }
    } catch { setError('Something went wrong. Try again.') }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading} className="bg-gray-900 text-white py-2 rounded-lg hover:bg-yellow-500 transition font-semibold">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">Don't have an account?{' '}<Link to="/register" className="text-yellow-500 font-semibold hover:underline">Register</Link></p>
    </div>
  )
}
export default LoginPage
