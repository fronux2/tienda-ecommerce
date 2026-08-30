'use client'
import { useState } from 'react'
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaTimes } from 'react-icons/fa'
import Image from "next/image"
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/formatPrice'

const Cart = ({ userId }: { userId: string | null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)

  const cart = useCartStore((s) => s.cart)
  const totalItems = useCartStore((s) => s.totalItems)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeFromCart = useCartStore((s) => s.removeFromCart)
  const clearCart = useCartStore((s) => s.clearCart)

  const total = cart.reduce((acc, item) => acc + item.cantidad * (item.mangas?.precio ?? 0), 0)
  const router = useRouter()
  return (
    <div className="relative">
      {/* Botón del carrito en el navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 group rounded-full active:scale-90 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        aria-label="Abrir carrito"
      >
        <FaShoppingCart 
          className="text-cream group-hover:text-primary-light transition-colors" 
          size={20} 
        />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Panel del carrito */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-surface z-50 shadow-2xl transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Encabezado */}
        <div className="bg-primary p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-white/80 rounded-full active:scale-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar carrito"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="p-4 overflow-y-auto h-[calc(100%-150px)]">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto bg-cream w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaShoppingCart className="text-primary" size={24} />
              </div>
              <p className="text-text-secondary">Tu carrito está vacío</p>
              <p className="text-text-muted text-sm mt-1">Agrega algunos mangas para empezar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.manga_id} className="flex gap-3 border-b pb-4 last:border-b-0 last:pb-0">
                  {item.mangas && (
                    <>
                      <div className="shrink-0">
                        <Image
                          src={item.mangas.imagen_portada}
                          alt={item.mangas.titulo}
                          width={60}
                          height={90}
                          className="rounded-md object-cover border border-border"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-text line-clamp-1">{item.mangas.titulo}</h3>
                        <p className="text-sm text-text-secondary">{formatPrice(item.mangas.precio)}</p>

                        <div className="flex items-center mt-2 gap-2">
                          <button
                            onClick={() => updateQuantity(userId, item.manga_id, item.cantidad - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-cream border border-border rounded-md hover:bg-surface-alt active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
                            disabled={item.cantidad <= 1 || cartLoading}
                            aria-label="Reducir cantidad"
                          >
                            <FaMinus size={10} />
                          </button>

                          <span className="text-sm w-6 text-center">{item.cantidad}</span>

                          <button
                            onClick={() => updateQuantity(userId, item.manga_id, item.cantidad + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-cream border border-border rounded-md hover:bg-surface-alt active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
                            disabled={item.cantidad >= (item.mangas.stock || 10) || cartLoading}
                            aria-label="Aumentar cantidad"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={async () => {
                            if (cartLoading) return
                            setCartLoading(true)
                            try { await removeFromCart(item.manga_id, userId) }
                            finally { setCartLoading(false) }
                          }}
                          className="text-primary hover:text-primary-hover rounded-full active:scale-90 transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
                          disabled={cartLoading}
                          aria-label="Eliminar del carrito"
                        >
                          <FaTrash size={16} />
                        </button>
                        <p className="font-semibold text-primary">
                          {formatPrice(item.cantidad * item.mangas.precio)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botones */}
        {cart.length > 0 && (
          <div className="border-t p-4 bg-cream">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-text">Total:</span>
              <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-lg transition flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
                onClick={async () => {
                  if (cartLoading) return
                  setCartLoading(true)
                  try { await clearCart(userId) }
                  finally { setCartLoading(false) }
                }}
                disabled={cartLoading}
              >
                <FaTrash className="mr-1" size={14} />
                Vaciar
              </button>
              
              <button
                className="bg-ink hover:bg-ink/90 text-white py-2 px-4 rounded-lg transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
                onClick={() => {
                  setIsOpen(false)
                  router.push('/checkout')
                }}
              >
                Comprar
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Fondo oscuro para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-ink bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default Cart