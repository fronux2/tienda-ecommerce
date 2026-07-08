"use client"

import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { getMangaById } from '@/lib/supabase/services/mangas.client';
import { NuevoManga } from '@/types/supabase';
import LoadingButton from './LoadingButton';

export function AddCardButton2({ mangaId, userId }: { mangaId: string, userId: string | null }) {
  const [manga, setManga] = useState<NuevoManga | null>(null)
  const [loading, setLoading] = useState(false)
  const cart = useCartStore((state) => state.cart)

  useEffect(() => {
    const fetchManga = async () => {
      const data = await getMangaById(mangaId)
      setManga(data[0])
    }
    fetchManga()
  }, [ mangaId ])

  const addToCart = useCartStore((state) => state.addToCart)

  const cartItem = cart.find(i => i.manga_id === mangaId)
  const enCarrito = cartItem?.cantidad ?? 0
  const stockAgotado = manga ? enCarrito >= manga.stock : false

  const handleClick = async () => {
    if (!manga || loading || stockAgotado) return
    setLoading(true)
    try {
      await addToCart({ manga_id: mangaId, cantidad: 1, usuario_id: userId, mangas: manga })
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton
      onClick={handleClick}
      loading={loading}
      disabled={stockAgotado || loading}
      type="button"
      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition-colors duration-300"
    >
      {stockAgotado ? 'Stock agotado en carrito' : 'Añadir al Carrito'}
    </LoadingButton>
  )
}