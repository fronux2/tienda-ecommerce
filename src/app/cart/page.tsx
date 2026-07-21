'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/formatPrice'
import useUser from '@/hooks/useUser'
import LoadingButton from '@/components/LoadingButton'

const CartPage = () => {
  const { user } = useUser()
  const userId = user?.id ?? null
  const router = useRouter()
  const cart = useCartStore((s) => s.cart)
  const totalItems = useCartStore((s) => s.totalItems)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeFromCart = useCartStore((s) => s.removeFromCart)
  const clearCart = useCartStore((s) => s.clearCart)
  const [loading, setLoading] = useState(false)

  const total = cart.reduce((acc, item) => acc + item.cantidad * (item.mangas?.precio ?? 0), 0)

  const handleRemove = async (mangaId: string) => {
    if (loading) return
    setLoading(true)
    try {
      await removeFromCart(mangaId, userId)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    if (loading) return
    setLoading(true)
    try {
      await clearCart(userId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
          {totalItems > 0 && (
            <p className="text-gray-500 mt-1">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
          )}
        </div>
        <Link
          href="/mangas"
          className="text-red-600 hover:text-red-700 font-medium transition-colors active:scale-95"
        >
          Seguir comprando
        </Link>
      </div>

      {cart.length === 0 ? (
        /* Estado vacío */
        <div className="text-center py-16">
          <div className="mx-auto bg-[#FFF8F0] w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <FaShoppingCart className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8">Agrega algunos mangas para empezar</p>
          <Link
            href="/mangas"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition-colors active:scale-95"
          >
            Explorar mangas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              if (!item.mangas) return null
              const subtotal = item.cantidad * item.mangas.precio
              return (
                <div
                  key={item.manga_id}
                  className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="shrink-0">
                    <Image
                      src={item.mangas.imagen_portada}
                      alt={item.mangas.titulo}
                      width={80}
                      height={120}
                      className="rounded-md object-cover border border-gray-200"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/mangas/${item.mangas.id}`}
                      className="font-semibold text-gray-900 hover:text-red-600 transition-colors line-clamp-1"
                    >
                      {item.mangas.titulo}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">{formatPrice(item.mangas.precio)}</p>

                    <div className="flex items-center mt-3 gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(userId, item.manga_id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1 || loading}
                          className="w-8 h-8 flex items-center justify-center bg-[#FFF8F0] border border-gray-300 rounded hover:bg-gray-100 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Reducir cantidad"
                        >
                          <FaMinus size={10} />
                        </button>

                        <span className="text-sm w-8 text-center font-medium">{item.cantidad}</span>

                        <button
                          onClick={() => updateQuantity(userId, item.manga_id, item.cantidad + 1)}
                          disabled={item.cantidad >= (item.mangas.stock || 99) || loading}
                          className="w-8 h-8 flex items-center justify-center bg-[#FFF8F0] border border-gray-300 rounded hover:bg-gray-100 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Aumentar cantidad"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>

                      {item.mangas.stock <= 5 && item.mangas.stock > 0 && (
                        <span className="text-xs text-amber-600 font-medium">
                          ¡Solo {item.mangas.stock} restantes!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => handleRemove(item.manga_id)}
                      disabled={loading}
                      className="text-gray-400 hover:text-red-600 active:scale-90 transition-all disabled:opacity-50"
                      aria-label="Eliminar del carrito"
                    >
                      <FaTrash size={16} />
                    </button>
                    <p className="font-semibold text-red-600 whitespace-nowrap">
                      {formatPrice(subtotal)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-[#FFF8F0] border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen</h2>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Productos ({totalItems})</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="border-t border-gray-300 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-red-600">{formatPrice(total)}</span>
                </div>
              </div>

              <LoadingButton
                onClick={() => router.push('/checkout')}
                loading={false}
                disabled={loading}
                className="w-full mt-6 bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg"
              >
                Ir a pagar
              </LoadingButton>

              <LoadingButton
                onClick={handleClear}
                loading={loading}
                className="w-full mt-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              >
                <FaTrash size={14} />
                Vaciar carrito
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
