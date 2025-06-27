"use client"
import { Suspense, useMemo, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useMangaStore } from "@/store/mangaStore";

// Carga diferida del componente Card1 con placeholder
const Card1 = dynamic(() => import("./Card1.client"), {
  loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />,
  ssr: false
});

export default function Popular({ id }: { id: string }) {
    const loadMangasPopulares = useMangaStore((state) => state.loadMangasPopulares);
    const mangas = useMangaStore((state) => state.mangas);
    
    // Memoize filtered mangas to prevent unnecessary recalculations
    const popularMangas = useMemo(() => (
        mangas.filter((manga) => manga.es_popular === true)
    ), [mangas]);

    useEffect(() => {
        loadMangasPopulares();
    }, [loadMangasPopulares]);

    return (
        <section className="bg-[#FFF8F0] py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-red-600">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-black mb-2">Mangas Populares</h2>
                <p className="text-xl text-center text-gray-800 mb-12">Los favoritos de nuestros lectores</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
                    <Suspense fallback={
                        // Placeholder skeleton while loading
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
                        ))
                    }>
                        {popularMangas.map(manga => (
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
                    </Suspense>
                </div>
            </div>
        </section>
    );
}