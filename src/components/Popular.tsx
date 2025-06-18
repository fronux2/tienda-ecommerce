"use client"
import Card1 from "./Card1.client"
//import { getTopMangas } from "@/lib/supabase/services/mangas.server";
import { useMangaStore } from "@/store/mangaStore";
//import { Manga } from "@/types/supabase";
import { useEffect } from "react";
export default function Popular() {
    const loadMangasPopulares = useMangaStore((state) => state.loadMangasPopulares)
    const mangas = useMangaStore((state) => state.mangas)
    useEffect(() => {
        loadMangasPopulares()
    }, [loadMangasPopulares])
    return (
        <div className="grid justify-center items-center lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 lg:p-16 md:p-6 sm:p-4 py-20">
            {mangas.map(manga => (
                <Card1
                    key={manga.id}
                    id={manga.id}
                    imagen={manga.imagen_portada}
                    titulo={manga.titulo}
                    autor={manga.autor}
                    editorial={manga.editorial}
                    precio={manga.precio}                    
                />
            ))}
        </div>
    )}