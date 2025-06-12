"use client"

import { useCartStore } from '@/store/cartStore';

export function AddCardButton2({ mangaId, userId }: { mangaId: string, userId: string }) {
  const addToCart = useCartStore((state) => state.addToCart)
  if (!userId) return
  return (
    <button
      onClick={() => addToCart({ manga_id: mangaId, cantidad: 1, user_id: userId })}
      type="button"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Añadir al Carrito22
    </button>
  )
}