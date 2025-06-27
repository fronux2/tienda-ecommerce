"use client"
import Image from "next/image";
import Link from "next/link";
import { Suspense, lazy } from "react";

// Carga diferida del botón para reducir el bundle inicial
const AddCardButton2 = lazy(() => import("./AddCardButton2"))

// Miniaturas base64 para el efecto blur (ejemplo - reemplaza con tus valores reales)
const placeholderBlur = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNTYwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+";

export default function Card1({ id, imagen, titulo, autor, editorial, precio, userId }: {
  id: string;
  imagen: string;
  titulo: string;
  autor: string;
  editorial: string;
  precio: number;
  userId: string;
}) {
  return (
    <article className="bg-[#FFF8F0] rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-red-600 transition-all duration-300 w-64">
      <Link href={`/mangas/${id}`} prefetch={false} className="block group">
        {/* Contenedor de imagen optimizado */}
        <div className="relative h-72 w-full bg-white flex items-center justify-center">
          <Image
            src={imagen}
            alt={`Portada de ${titulo}`}
            width={400}
            height={560}
            className="w-40 h-56 object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            quality={80}
            placeholder="blur"
            blurDataURL={placeholderBlur}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Etiqueta de popular optimizada */}
          <span className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
            POPULAR
          </span>
        </div>
      </Link>

      <div className="p-4">
        {/* Título optimizado para SEO y rendimiento */}
        <h3 className="text-lg font-bold text-black mb-2 hover:text-red-600 transition-colors line-clamp-2 h-14">
          <Link href={`/mangas/${id}`} prefetch={false} className="hover:text-red-600">
            {titulo}
          </Link>
        </h3>
        
        {/* Información optimizada con mínimo CLS */}
        <div className="space-y-1 mb-3 min-h-[72px]">
          <p className="text-sm text-gray-800 flex">
            <span className="font-semibold text-black min-w-[70px]">Autor:</span> 
            <span className="flex-1 line-clamp-2">{autor}</span>
          </p>
          <p className="text-sm text-gray-800 flex">
            <span className="font-semibold text-black min-w-[70px]">Editorial:</span> 
            <span className="flex-1 line-clamp-2">{editorial}</span>
          </p>
        </div>

        {/* Precio y botón optimizados */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-red-600">${precio.toFixed(2)}</p>
          <Suspense fallback={
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          }>
            <AddCardButton2 
              mangaId={id} 
              userId={userId} 
            />
          </Suspense>
        </div>
      </div>
    </article>
  );
}