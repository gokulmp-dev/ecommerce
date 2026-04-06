import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-500 text-sm">{product.brand}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-yellow-500 font-bold text-lg">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-500 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard