// app/mangas/[id]/MangaDetailClient.tsx
"use client"
import Image from 'next/image'
import React from 'react'
import Link from 'next/link' // Importamos Link para el botón de volver
import { useMangaStore } from '@/store/mangaStore'
import { type Manga } from '@/types/supabase'
import { AddCardButton2 } from '@/components/AddCardButton2'
import useUser from '@/hooks/useUser'

type Props = {
  id?: string
}

const MangaDetailClient = ({ id }: Props) => {
  const mangas: Manga[] = useMangaStore((state) => state.mangas)
  const manga = mangas.find((m) => m.id === id)
  const { user } = useUser()

  // -- UI para ID no válido --
  if (!id) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-[#FFF8F0]">
        <h2 className="text-2xl font-bold mb-4">Bienvenido a MangaNihon</h2>
        <Link href="/mangas" className="text-red-500 hover:text-red-400 underline">
          Explora nuestro catálogo completo
        </Link>
      </div>
    )
  }
  
  // -- UI para Manga no encontrado (Estilo Dark) --
  if (!manga) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-neutral-900 border border-red-600/50 text-[#FFF8F0] rounded-lg text-center shadow-lg shadow-red-900/20">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Manga no encontrado</h1>
        <p className="text-gray-400 mb-6">No pudimos encontrar el manga con ID: <span className="font-mono text-sm bg-black px-2 py-1 rounded">{id}</span></p>
        <Link href="/mangas" className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded transition-colors">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  // Helper para renderizar etiquetas de estado (colores dinámicos opcionales)
  const isAvailable = manga.stock > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#FFF8F0] pb-20">
      
      {/* Fondo decorativo difuminado (Opcional, da un toque muy pro) */}
      <div className="absolute top-0 left-0 w-full h-100 overflow-hidden opacity-20 pointer-events-none z-0">
         <Image
            src={manga.imagen_portada || "/placeholder.jpg"}
            alt="Background blur"
            fill
            className="object-cover blur-3xl"
         />
         <div className="absolute inset-0 bg-linear-to-b from-black/20 to-[#0a0a0a]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* Breadcrumb / Botón Volver */}
        <Link href="/mangas" className="inline-flex items-center text-gray-400 hover:text-red-500 mb-8 transition-colors group">
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* COLUMNA IZQUIERDA: Imagen */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 border-2 border-neutral-800">
              <Image
                src={manga.imagen_portada || "/placeholder.jpg"}
                alt={`Portada de ${manga.titulo}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
              {/* Badge de Stock flotante */}
              <div className="absolute top-4 right-4">
                 {isAvailable ? (
                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      EN STOCK
                    </span>
                 ) : (
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      AGOTADO
                    </span>
                 )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Detalles */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-start space-y-6">
            
            {/* Cabecera del Producto */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {manga.categorias?.nombre && (
                  <span className="bg-red-600/10 text-red-500 border border-red-600/30 text-xs font-semibold px-3 py-1 rounded uppercase tracking-wide">
                    {manga.categorias.nombre}
                  </span>
                )}
                 <span className="bg-neutral-800 text-gray-300 border border-neutral-700 text-xs font-semibold px-3 py-1 rounded uppercase tracking-wide">
                    {manga.idioma}
                  </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
                {manga.titulo}
              </h1>
              <p className="text-xl text-gray-400 font-medium">
                {manga.editorial}
              </p>
            </div>

            {/* Precio y Acción */}
            <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Disponibilidad:</span>
                    <span className={`font-bold ${isAvailable ? 'text-green-400' : 'text-red-500'}`}>
                        {manga.stock} unidades
                    </span>
                </div>
                {/* Botón para agregar al carrito */}
                {isAvailable ? (
                  <AddCardButton2 mangaId={manga.id} userId={user?.id || ''} />
                ) : (
                  <button 
                    disabled
                    className="w-full py-3 px-4 rounded-lg font-bold text-lg bg-neutral-800 text-gray-500 cursor-not-allowed"
                  >
                    Sin Stock
                  </button>
                )}
            </div>

            {/* Descripción */}
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-bold text-white mb-2 border-l-4 border-red-600 pl-3">Sinopsis</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {manga.descripcion}
              </p>
            </div>

            {/* Grid de Especificaciones Técnicas */}
            <div className="pt-6 border-t border-neutral-800">
               <h3 className="text-xl font-bold text-white mb-4">Detalles Técnicos</h3>
               <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <DetailItem label="ISBN" value={manga.isbn} />
                  <DetailItem label="Editorial" value={manga.editorial} />
                  <DetailItem label="Volumen" value={manga.volumen} />
                  <DetailItem label="Páginas" value={manga.numero_paginas} />
                  <DetailItem label="Estado" value={manga.estado} />
                  <DetailItem label="Categoría" value={manga.categorias?.nombre || 'N/A'} />
               </dl>
               {manga.categorias?.descripcion && (
                 <div className="mt-4 text-sm text-gray-500 italic bg-neutral-900 p-3 rounded border border-neutral-800">
                   Sobre {manga.categorias.nombre}: {manga.categorias.descripcion}
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-componente simple para las filas de detalles
const DetailItem = ({ label, value }: { label: string, value: string | number | undefined | null }) => (
  <div className="flex justify-between border-b border-neutral-800 pb-2">
    <dt className="text-gray-500 font-medium">{label}</dt>
    <dd className="text-[#FFF8F0] font-semibold text-right">{value || '---'}</dd>
  </div>
);

export default React.memo(MangaDetailClient)