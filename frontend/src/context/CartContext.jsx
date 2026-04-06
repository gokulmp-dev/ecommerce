import { createContext, useState, useContext } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : []
  )

  const addToCart = (product) => {
    const exists = cartItems.find(item => item._id === product._id)

    let updatedCart
    if (exists) {
      updatedCart = cartItems.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    } else {
      updatedCart = [...cartItems, { ...product, qty: 1 }]
    }

    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return
    const updatedCart = cartItems.map(item =>
      item._id === id ? { ...item, qty } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty, 0
  )

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.qty, 0
  )

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalPrice,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)