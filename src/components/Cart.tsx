'use client'

import { useCart } from '../hooks/useCart'
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import Image from "next/image";

const Cart = ({userId}: {userId: string | null}) => { 
  console.log("userId5", userId)
  const {
    cartItems,
    total,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart(userId)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tu Carrito</h1>
      
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center border-b pb-4">
              <Image 
                src={item.mangas.imagen_portada} 
                alt={item.mangas.titulo} 
                width={200}
                height={280}
                className="w-20 h-28 object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.mangas.titulo}</h3>
                <p className="text-gray-600">${item.mangas.precio}</p>
              </div>
              
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
                  disabled={item.cantidad >= item.mangas.stock}
                >
                  <FaPlus size={12} />
                </button>
              </div>
              
              <div className="ml-4">
                <p className="font-semibold">
                  ${(item.cantidad * item.mangas.precio).toFixed(2)}
                </p>
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
              <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
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