"use client"
import Image from 'next/image'
import { useMangaStore } from '@/store/mangaStore'
type Props = {
  params: {
    id: string
  }
}

export default function Page({params}: Props) {
  const {id} = params
  console.log(id)
  const mangas = useMangaStore((state) => state.mangas)
  console.log(mangas)
  const manga = mangas.filter((manga) => manga.id === id)  
  console.log(manga)

  console.log(mangas)
     return (
      <div className="max-w-3xl mx-auto p-6 bg-purple-50 shadow-lg rounded-2xl mt-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Detalles del Manga</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="w-64 h-96 relative rounded-lg overflow-hidden shadow-md border border-purple-200">
            <Image
              src={manga[0].imagen_portada || "/placeholder.jpg"} // Cambia esto por tu campo real
              alt={`Portada de ${manga[0].titulo}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="space-y-4 text-purple-900">
          <p><span className="font-semibold text-purple-600">Título:</span> {manga[0].titulo}</p>
          <p><span className="font-semibold text-purple-600">Descripción:</span> {manga[0].descripcion}</p>
          <p><span className="font-semibold text-purple-600">Estado:</span> {manga[0].estado}</p>
          <p><span className="font-semibold text-purple-600">Idioma:</span> {manga[0].idioma}</p>
          <p><span className="font-semibold text-purple-600">ISBN:</span> {manga[0].isbn}</p>
          <p><span className="font-semibold text-purple-600">Número de páginas:</span> {manga[0].numero_paginas}</p>
          <p><span className="font-semibold text-purple-600">Stock:</span> {manga[0].stock}</p>
          <p><span className="font-semibold text-purple-600">Volumen:</span> {manga[0].volumen}</p>
          <p><span className="font-semibold text-purple-600">Editorial:</span> {manga[0].editorial}</p>
          <p><span className="font-semibold text-purple-600">Categoría:</span> {manga[0].categorias.nombre}</p>
          <p><span className="font-semibold text-purple-600">Descripción de categoría:</span> {manga[0].categorias.descripcion}</p>
        </div>
      </div>
    )

}