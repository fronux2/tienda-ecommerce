'use client'
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import Image from "next/image";
import { useCartStore } from '@/store/cartStore';
const Cart = () => { 
  const cart = useCartStore((state) => state.cart)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tu Carrito</h1>
      
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex items-center border-b pb-4">
              
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                  className="p-1 rounded-full bg-gray-200"
                >
                  <FaMinus size={12} />
                </button>
                
                <span>{item.cantidad}</span>
                
                <button 
                  onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                  className="p-1 rounded-full bg-gray-200"
                >
                  <FaPlus size={12} />
                </button>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={clearCart}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Vaciar Carrito
            </button>
            
            <div className="text-right">
              <button 
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => window.location.href = '/checkout'}
              >
                Finalizar Compra
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart