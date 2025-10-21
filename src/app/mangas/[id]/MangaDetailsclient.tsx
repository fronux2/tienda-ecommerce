// app/mangas/[id]/MangaDetailClient.tsx
"use client"
import Image from 'next/image'
import React from 'react'
import { useMangaStore } from '@/store/mangaStore'
import { type Manga } from '@/types/supabase'

type Props = {
  id?: string
}

const MangaDetailClient = ({ id }: Props) => {
  const mangas: Manga[] = useMangaStore((state) => state.mangas)
  const manga = mangas.find((m) => m.id === id)

  if (!id) {
    return (
      <div>
        {/* UI para usuario anónimo */}
        <p>Bienvenido — mira nuestros mangas populares</p>
      </div>
    )
  }
  
  if (!manga) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Manga no encontrado</h1>
        <p>No se pudo cargar el manga con ID: {id}. Por favor, verifica la URL.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-purple-50 shadow-lg rounded-2xl mt-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Detalles del Manga</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="w-64 h-96 relative rounded-lg overflow-hidden shadow-md border border-purple-200">
          <Image
            src={manga.imagen_portada || "/placeholder.jpg"}
            alt={`Portada de ${manga.titulo}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="space-y-4 text-purple-900">
        <p><span className="font-semibold text-purple-600">Título:</span> {manga.titulo}</p>
        <p><span className="font-semibold text-purple-600">Descripción:</span> {manga.descripcion}</p>
        <p><span className="font-semibold text-purple-600">Estado:</span> {manga.estado}</p>
        <p><span className="font-semibold text-purple-600">Idioma:</span> {manga.idioma}</p>
        <p><span className="font-semibold text-purple-600">ISBN:</span> {manga.isbn}</p>
        <p><span className="font-semibold text-purple-600">Número de páginas:</span> {manga.numero_paginas}</p>
        <p><span className="font-semibold text-purple-600">Stock:</span> {manga.stock}</p>
        <p><span className="font-semibold text-purple-600">Volumen:</span> {manga.volumen}</p>
        <p><span className="font-semibold text-purple-600">Editorial:</span> {manga.editorial}</p>
        <p><span className="font-semibold text-purple-600">Categoría:</span> {manga.categorias?.nombre || 'N/A'}</p>
        <p><span className="font-semibold text-purple-600">Descripción de categoría:</span> {manga.categorias?.descripcion || 'No disponible'}</p>
      </div>
    </div>
  )
}

export default React.memo(MangaDetailClient)
