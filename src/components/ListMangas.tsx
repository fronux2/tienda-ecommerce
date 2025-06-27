"use client";
import Card1 from "@/components/Card1.client";
import { getSeriesClient } from "@/lib/supabase/services/series.client";
import { getCategoriasClient } from "@/lib/supabase/services/categorias.client";
import { Categoria, Serie, type Manga } from "@/types/supabase";
import { useEffect, useMemo, useState } from "react";
import { useMangaStore } from "@/store/mangaStore";
import { Filters } from "@/components/Filter";

interface ListMangasProps {
  mangas: Manga[];
  userId: string;
}

export default function ListMangas({ mangas, userId }: ListMangasProps) {
  const [series, setSeries] = useState<Serie[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [serieSeleccionada, setSerieSeleccionada] = useState("Todas");
  const addMangas = useMangaStore((state) => state.addMangas);

  // Memoizar el filtrado para evitar recálculos innecesarios
  const mangasFiltrados = useMemo(() => {
    return mangas.filter((manga) => {
      const coincideCategoria = 
        categoriaSeleccionada === "Todos" || 
        manga.categorias?.nombre === categoriaSeleccionada;
      
      const coincideSerie = 
        serieSeleccionada === "Todas" || 
        manga.series?.nombre === serieSeleccionada;
      
      return coincideCategoria && coincideSerie;
    });
  }, [mangas, categoriaSeleccionada, serieSeleccionada]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      addMangas(mangas);
      
      try {
        const [categoriasData, seriesData] = await Promise.all([
          getCategoriasClient(),
          getSeriesClient(),
        ]);
        
        setCategorias(categoriasData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [mangas, addMangas]);

  return (
    <section className="space-y-8">
      {/* Encabezado y Filtros */}
      <header className="bg-[#FFF8F0] p-6 rounded-xl border-2 border-red-600 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
          Explora nuestra colección
          <span className="block h-1 w-16 bg-red-600 rounded-full mt-2"></span>
        </h2>
        
        <Filters
          categorias={categorias}
          series={series}
          categoriaSeleccionada={categoriaSeleccionada}
          serieSeleccionada={serieSeleccionada}
          onCategoriaChange={setCategoriaSeleccionada}
          onSerieChange={setSerieSeleccionada}
        />
      </header>

      {/* Resultados */}
      <MangasList mangas={mangasFiltrados} userId={userId} />
    </section>
  );
}

interface MangasListProps {
  mangas: Manga[];
  userId: string;
}

const MangasList = ({ mangas, userId }: MangasListProps) => {
  if (mangas.length === 0) {
    return (
      <article className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300 text-center max-w-2xl mx-auto">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="text-xl font-bold text-black mb-2">No se encontraron mangas</h3>
        <p className="text-gray-700">
          Prueba con diferentes filtros para encontrar lo que buscas
        </p>
      </article>
    );
  }

  return (
    <ul className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {mangas.map((manga) => (
        <li key={manga.id} className="w-full max-w-xs">
          <Card1
            id={manga.id}
            imagen={manga.imagen_portada}
            titulo={manga.titulo}
            autor={manga.autor}
            editorial={manga.editorial}
            precio={manga.precio}
            userId={userId}
          />
        </li>
      ))}
    </ul>
  );
};