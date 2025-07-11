"use client"
import Image from "next/image";
//import {AddCardButton2 } from "@/components/AddCardButton2";
import Link from "next/link";
import { AddCardButton2 } from "./AddCardButton2";

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
    <main className="bg-[#FFF8F0] rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-red-600 transition-all duration-300 w-64">
      <Link href={`/mangas/${id}`} className="block">
        {/* Contenedor de imagen con efecto hover */}
        <div className="relative overflow-hidden">
          <div className="relative h-72 w-full bg-white flex items-center justify-center">
            <Image
              src={imagen}
              alt={titulo}
              width={400}
              height={560}
              className="w-40 h-56 object-contain transition-transform duration-500 hover:scale-105"
            />
            {/* Etiqueta de popular */}
            <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
              POPULAR
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        {/* Título con efecto hover */}
        <Link href={`/mangas/${id}`}>
          <h3 className="text-lg font-bold text-black mb-2 hover:text-red-600 transition-colors line-clamp-2 h-14">
            {titulo}
          </h3>
        </Link>
        
        {/* Información del autor y editorial */}
        <div className="space-y-1 mb-3">
          <p className="text-sm text-gray-800 flex items-start">
            <span className="font-semibold text-black min-w-[70px]">Autor:</span> 
            <span className="flex-1">{autor}</span>
          </p>
          <p className="text-sm text-gray-800 flex items-start">
            <span className="font-semibold text-black min-w-[70px]">Editorial:</span> 
            <span className="flex-1">{editorial}</span>
          </p>
        </div>

        {/* Precio y botón de añadir */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-red-600">${precio}</p>
          <AddCardButton2 
            mangaId={id} 
            userId={userId} 
          />
        </div>
      </div>
    </main>
  );
}