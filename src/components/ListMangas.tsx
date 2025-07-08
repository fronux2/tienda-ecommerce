"use client";
import Card1 from "@/components/Card1.client";
import { getSeriesClient } from "@/lib/supabase/services/series.client";
import { getCategoriasClient } from "@/lib/supabase/services/categorias.client";
import { Categoria, Serie, type Manga } from "@/types/supabase";
import { useEffect, useMemo, useState } from "react";
import { useMangaStore } from "@/store/mangaStore";

export default function ListMangas({ mangas, userId }: { mangas: Manga[], userId: string }) {
  const [series, setSeries] = useState<Serie[]>([])
  const [categoria, setCategoria] = useState<Categoria[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [serieSeleccionada, setserieSeleccionada] = useState("Todas");
  const [mangasFiltrados, setMangasFiltrados] = useState<Manga[]>([]);
  const addMangas = useMangaStore((state) => state.addMangas)

 
  // Filtrado flexible por categoría y/o serieSeleccionada
  const filterMangas = useMemo(() => {
    return (categoriaSeleccionada: string, serieSeleccionada: string) => {
      return mangas.filter((manga) => {
        const coincideCategoriaSeleccionada =
          categoriaSeleccionada === "Todos" || manga.categorias?.nombre === categoriaSeleccionada;

        const coincideserieSeleccionada =
          serieSeleccionada === "Todas" || manga.series?.nombre === serieSeleccionada;
        return coincideCategoriaSeleccionada && coincideserieSeleccionada;
      });
    };
  }, [mangas]);

  useEffect(() => {
    addMangas(mangas)
    const fetchSeriesCat = async () => {
      const categoria = await getCategoriasClient();
      setCategoria(categoria);
      const series = await getSeriesClient();
      setSeries(series);
    };
    fetchSeriesCat();
    setMangasFiltrados(filterMangas(categoriaSeleccionada, serieSeleccionada));
  }, [categoriaSeleccionada, serieSeleccionada, filterMangas]);

  return (
    <section className="space-y-8">
      {/* Encabezado y Filtros */}
      <header className="bg-[#FFF8F0] p-6 rounded-xl border-2 border-red-600 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
          Explora nuestra colección
          <span className="block h-1 w-16 bg-red-600 rounded-full mt-2"></span>
        </h2>
        
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de categoría */}
          <figure className="relative">
            <label htmlFor="categoria" className="block text-black font-medium mb-2">
              Filtrar por categoría
            </label>
            <div className="relative">
              <select
                id="categoria"
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                value={categoriaSeleccionada}
                className="w-full p-3 pl-4 pr-10 rounded-lg border-2 border-gray-300 bg-white text-black shadow-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 appearance-none"
              >
                <option value="Todos">Todas las categorías</option>
                {categoria.map((categoria) => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </figure>

          {/* Selector de serie */}
          <figure className="relative">
            <label htmlFor="serie" className="block text-black font-medium mb-2">
              Filtrar por serie
            </label>
            <div className="relative">
              <select
                id="serie"
                onChange={(e) => setserieSeleccionada(e.target.value)}
                value={serieSeleccionada}
                className="w-full p-3 pl-4 pr-10 rounded-lg border-2 border-gray-300 bg-white text-black shadow-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 appearance-none"
              >
                <option value="Todas">Todas las series</option>
                {series.map((serie) => (
                  <option key={serie.id} value={serie.nombre}>
                    {serie.nombre}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </figure>
        </fieldset>
      </header>

      {/* Resultados */}
      <section>
        {mangasFiltrados.length > 0 ? (
          <ul className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mangasFiltrados.map((manga) => (
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
        ) : (
          <article className="bg-white rounded-xl p-8 border-2 border-dashed border-gray-300 text-center max-w-2xl mx-auto">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-black mb-2">No se encontraron mangas</h3>
            <p className="text-gray-700">
              Prueba con diferentes filtros para encontrar lo que buscas
            </p>
          </article>
        )}
      </section>
    </section>
  );
}
