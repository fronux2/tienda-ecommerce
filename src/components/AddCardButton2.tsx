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
  }, [ mangaId ])

  const addToCart = useCartStore((state) => state.addToCart)
  if (!userId) return
  return (
    <button
      onClick={() => {
        if (!manga) return;
        addToCart({ manga_id: mangaId, cantidad: 1, usuario_id: userId, mangas: manga })}}
      type="button"
      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition-colors duration-300"
    >
      Añadir al Carrito
    </button>
  )
}