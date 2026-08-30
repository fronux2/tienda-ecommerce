"use client"
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { type Manga } from '@/types/supabase'
import { AddToCartButton } from '@/components/AddToCartButton'
import Badge from '@/components/Badge'
import useUser from '@/hooks/useUser'

type Props = {
  id?: string
  manga: Manga | null
}

const MangaDetailClient = ({ id, manga }: Props) => {
  const { user } = useUser()

  // -- UI para ID no válido --
  if (!id) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-text">
        <h2 className="text-2xl font-bold mb-4">Bienvenido a MangaNihon</h2>
        <Link href="/mangas" className="text-primary hover:text-primary-hover underline">
          Explora nuestro catálogo completo
        </Link>
      </div>
    )
  }

  // -- UI para Manga no encontrado --
  if (!manga) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-surface border border-primary/30 text-text rounded-lg text-center shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-primary">Manga no encontrado</h1>
        <p className="text-text-secondary mb-6">No pudimos encontrar el manga con ID: <span className="font-mono text-sm bg-surface-alt px-2 py-1 rounded-md">{id}</span></p>
        <Link href="/mangas" className="inline-block bg-primary hover:bg-primary-hover text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const isAvailable = manga.stock > 0;

  return (
    <div className="min-h-screen bg-cream text-text pb-20">

      {/* Portada difuminada como fondo ambiental — la "vitrina" del volumen */}
      <div className="absolute top-0 left-0 w-full h-100 overflow-hidden opacity-20 pointer-events-none z-0">
         <Image
            src={manga.imagen_portada || "/placeholder.jpg"}
            alt="Background blur"
            fill
            className="object-cover blur-3xl"
         />
         <div className="absolute inset-0 bg-linear-to-b from-black/10 to-cream"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">

        {/* Breadcrumb / Botón Volver */}
        <Link href="/mangas" className="inline-flex items-center text-text-secondary hover:text-primary mb-8 transition-colors group rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light">
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* COLUMNA IZQUIERDA: Imagen */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
            <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden shadow-2xl border-2 border-border">
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
                    <span className="bg-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      EN STOCK
                    </span>
                 ) : (
                    <span className="bg-danger text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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
                  <span className="bg-primary/10 text-primary border border-primary/30 text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wide">
                    {manga.categorias.nombre}
                  </span>
                )}
                <Badge variant="neutral" className="text-xs font-semibold uppercase tracking-wide rounded-md">
                  {manga.idioma}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-text leading-tight mb-2">
                {manga.titulo}
              </h1>
              <p className="text-xl text-text-secondary font-medium">
                {manga.editorial}
              </p>
            </div>

            {/* Precio y Acción */}
            <div className="p-6 bg-surface border border-border rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-text-secondary">Disponibilidad:</span>
                    <span className={`font-bold ${isAvailable ? 'text-success' : 'text-danger'}`}>
                        {manga.stock} unidades
                    </span>
                </div>
                {/* Botón para agregar al carrito */}
                {isAvailable ? (
                  <AddToCartButton mangaId={manga.id} userId={user?.id ?? null} />
                ) : (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-lg font-bold text-lg bg-surface-alt text-text-muted cursor-not-allowed"
                  >
                    Sin Stock
                  </button>
                )}
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-xl font-bold text-text mb-2 border-l-4 border-primary pl-3">Sinopsis</h3>
              <p className="text-text-secondary leading-relaxed text-lg">
                {manga.descripcion}
              </p>
            </div>

            {/* Grid de Especificaciones Técnicas */}
            <div className="pt-6 border-t border-border">
               <h3 className="text-xl font-bold text-text mb-4">Detalles Técnicos</h3>
               <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <DetailItem label="ISBN" value={manga.isbn} />
                  <DetailItem label="Editorial" value={manga.editorial} />
                  <DetailItem label="Volumen" value={manga.volumen} />
                  <DetailItem label="Páginas" value={manga.numero_paginas} />
                  <DetailItem label="Estado" value={manga.estado} />
                  <DetailItem label="Categoría" value={manga.categorias?.nombre || 'N/A'} />
               </dl>
               {manga.categorias?.descripcion && (
                 <div className="mt-4 text-sm text-text-muted italic bg-surface p-3 rounded-md border border-border">
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
  <div className="flex justify-between border-b border-border pb-2">
    <dt className="text-text-muted font-medium">{label}</dt>
    <dd className="text-text font-semibold text-right">{value || '---'}</dd>
  </div>
);

export default React.memo(MangaDetailClient)
