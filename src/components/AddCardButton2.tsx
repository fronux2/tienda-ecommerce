"use client"

import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { getMangaById } from '@/lib/supabase/services/mangas.client';
import { NuevoManga } from '@/types/supabase';
import LoadingButton from './LoadingButton';

export function AddCardButton2({ mangaId, userId }: { mangaId: string, userId: string | null }) {
  const [manga, setManga] = useState<NuevoManga | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchManga = async () => {
      const data = await getMangaById(mangaId)
      setManga(data[0])
    }
    fetchManga()
  }, [ mangaId ])

  const addToCart = useCartStore((state) => state.addToCart)

  const handleClick = async () => {
    if (!manga || loading) return
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
      type="button"
      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition-colors duration-300"
    >
      Añadir al Carrito
    </LoadingButton>
  )
}