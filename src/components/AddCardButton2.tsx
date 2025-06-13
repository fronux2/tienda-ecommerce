"use client"

import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { getMangaById } from '@/lib/supabase/services/mangas.client';
import { NuevoManga } from '@/types/supabase';
export function AddCardButton2({ mangaId, userId }: { mangaId: string, userId: string }) {
  const [manga, setManga] = useState<NuevoManga | null>(null)
  useEffect(() => {
    const fetchManga = async () => {
      const data = await getMangaById(mangaId)
      setManga(data[0])
    }
    fetchManga()
  }, [])

  const addToCart = useCartStore((state) => state.addToCart)
  if (!userId) return
  return (
    <button
      onClick={() => addToCart({ manga_id: mangaId, cantidad: 1, usuario_id: userId, mangas: manga })}
      type="button"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Añadir al Carrito22
    </button>
  )
}