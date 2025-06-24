"use client";
import Card1 from "@/components/Card1.client";
import { getSeriesClient } from "@/lib/supabase/services/series.client";
import { getCategoriasClient } from "@/lib/supabase/services/categorias.client";
import { Categoria, Serie, type Manga } from "@/types/supabase";
import { useEffect, useMemo, useState } from "react";
import { useMangaStore } from "@/store/mangaStore";

export default function ListMangas({ mangas }: { mangas: Manga[] }) {
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
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de categoría */}
        <select
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          value={categoriaSeleccionada}
          className="w-full p-2 rounded bg-white text-black shadow"
        >
          <option value="Todos">Todas las categorías</option>
          {categoria.map((categoria) => (
            <option key={categoria.id} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        {/* Selector de serieSeleccionada */}
        <select
          onChange={(e) => setserieSeleccionada(e.target.value)}
          value={serieSeleccionada}
          className="w-full p-2 rounded bg-white text-black shadow"
        >
          <option value="Todas">Todas las serieSeleccionadas</option>
          {series.map((serie) => (
            <option key={serie.id} value={serie.nombre}>
              {serie.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de resultados */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mangasFiltrados.map((manga) => (
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
    </div>
  );
}
