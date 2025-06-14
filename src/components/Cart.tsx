'use client'
import { useState } from 'react'
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaTimes } from 'react-icons/fa'
import Image from "next/image"
import { useCartStore } from '@/store/cartStore'

const Cart = ({ userId }: { userId: string | null }) => {
  const [isOpen, setIsOpen] = useState(false)

  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore()

  const total = cart.reduce((acc, item) => acc + item.cantidad * (item.mangas?.precio ?? 0), 0)

  if (!userId) return null

  return (
    <>
      {/* Botón flotante del carrito */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
      >
        <FaShoppingCart size={20} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
            {cart.length}
          </span>
        )}
      </button>

      {/* Drawer del carrito */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold text-gray-800">Tu Carrito</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-200px)]">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Tu carrito está vacío 🛒</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.manga_id} className="flex gap-3 border p-2 rounded-lg shadow-sm">
                  {item.mangas && (
                    <>
                      <Image
                        src={item.mangas.imagen_portada}
                        alt={item.mangas.titulo}
                        width={60}
                        height={90}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold">{item.mangas.titulo}</h3>
                        <p className="text-xs text-gray-500">${item.mangas.precio}</p>

                        <div className="flex items-center mt-1 gap-2">
                          <button
                            onClick={() => updateQuantity(userId, item.manga_id, item.cantidad - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full"
                            disabled={item.cantidad <= 1}
                          >
                            <FaMinus size={10} />
                          </button>

                          <span className="text-sm">{item.cantidad}</span>

                          <button
                            onClick={() => updateQuantity(userId, item.manga_id, item.cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full"
                            disabled={item.cantidad >= item.mangas.stock}
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>

                        <p className="text-sm mt-1 font-semibold text-blue-600">
                          ${(item.cantidad * item.mangas.precio).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.manga_id, userId)}
                        className="text-red-500 hover:text-red-600"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer del carrito */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Total:</span>
            <span className="text-blue-600 font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-2"
            onClick={() => {
              setIsOpen(false)
              window.location.href = '/checkout'
            }}
          >
            Finalizar Compra
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => clearCart(userId)}
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </>
  )
}

export default Cart
