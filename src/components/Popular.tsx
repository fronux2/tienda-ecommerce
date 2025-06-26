"use client"
import Card1 from "./Card1.client"
//import { getTopMangas } from "@/lib/supabase/services/mangas.server";
import { useMangaStore } from "@/store/mangaStore";
//import { Manga } from "@/types/supabase";
import { useEffect } from "react";
export default function Popular({id}:{id:string}) {
    const loadMangasPopulares = useMangaStore((state) => state.loadMangasPopulares)
    const mangas = useMangaStore((state) => state.mangas)
    const filter = mangas.filter((manga) => manga.es_popular === true)
    useEffect(() => {
        loadMangasPopulares()
    }, [loadMangasPopulares])
    return (
        <section className="bg-[#FFF8F0] py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-black mb-2">Mangas Populares</h2>
        <p className="text-xl text-center text-gray-800 mb-12">Los favoritos de nuestros lectores</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
          {mangas.map(manga => (
            <Card1
              key={manga.id}
              id={manga.id}
              imagen={manga.imagen_portada}
              titulo={manga.titulo}
              autor={manga.autor}
              editorial={manga.editorial}
              precio={manga.precio}
              userId={id}
            />
          ))}
        </div>
      </div>
    </section>
    )}