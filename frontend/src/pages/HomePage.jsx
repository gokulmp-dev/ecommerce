import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${API_URL}/api/products`)
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Latest Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage