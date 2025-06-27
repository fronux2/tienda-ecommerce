'use client'
import { useState } from 'react'
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaTimes } from 'react-icons/fa'
import Image from "next/image"
import { useCart } from '@/context/CartContext'

const Cart = ({ userId }: { userId: string | null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice
  } = useCart()

  if (!userId) return null

  return (
    <div className="relative ml-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 group"
        aria-label="Abrir carrito"
        disabled={loading}
      >
        <FaShoppingCart 
          className={`text-[#FFF8F0] group-hover:text-red-500 transition-colors ${
            loading ? 'opacity-50' : ''
          }`} 
          size={20} 
        />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>

      {/* Panel del carrito */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Encabezado */}
        <div className="bg-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Cerrar carrito"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="p-4 overflow-y-auto h-[calc(100%-150px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Cargando tu carrito...</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto bg-[#FFF8F0] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaShoppingCart className="text-red-600" size={24} />
              </div>
              <p className="text-gray-700">Tu carrito está vacío</p>
              <p className="text-gray-500 text-sm mt-1">Agrega algunos mangas para empezar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.manga_id} className="flex gap-3 border-b pb-4 last:border-b-0 last:pb-0">
                  {item.mangas && (
                    <>
                      <div className="flex-shrink-0">
                        <Image
                          src={item.mangas.imagen_portada}
                          alt={item.mangas.titulo}
                          width={60}
                          height={90}
                          className="rounded-md object-cover border border-gray-200"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.mangas.titulo}</h3>
                        <p className="text-sm text-gray-600">${item.mangas.precio.toFixed(2)}</p>

                        <div className="flex items-center mt-2 gap-2">
                          <button
                            onClick={() => updateQuantity(userId, item.manga_id, item.cantidad - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-[#FFF8F0] border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.cantidad <= 1 || loading}
                          >
                            <FaMinus size={10} />
                          </button>

                          <span className="text-sm w-6 text-center">{item.cantidad}</span>

                          <button
                            onClick={() => updateQuantity(userId, item.manga_id, item.cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-[#FFF8F0] border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.cantidad >= (item.mangas.stock || 10) || loading}
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.manga_id, userId)}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          disabled={loading}
                        >
                          <FaTrash size={16} />
                        </button>
                        <p className="font-semibold text-red-600">
                          ${(item.cantidad * item.mangas.precio).toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && !loading && (
          <div className="border-t p-4 bg-[#FFF8F0]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-800">Total:</span>
              <span className="text-xl font-bold text-red-600">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition flex items-center justify-center disabled:opacity-50"
                onClick={() => clearCart(userId)}
                disabled={loading}
              >
                <FaTrash className="mr-1" size={14} />
                Vaciar
              </button>
              
              <button
                className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded transition disabled:opacity-50"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Comprar
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default Cart