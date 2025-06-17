"use client";
import Card1 from "@/components/Card1.client";
import { type Manga } from "@/types/supabase";
import { useEffect, useMemo, useState } from "react";

export default function ListMangas({ mangas }: { mangas: Manga[] }) {
  const [categoria, setCategoria] = useState("Todos");
  const [serie, setSerie] = useState("Todas");
  const [mangasFiltrados, setMangasFiltrados] = useState<Manga[]>([]);

  // Filtrado flexible por categoría y/o serie
  const filterMangas = useMemo(() => {
    return (categoria: string, serie: string) => {
      return mangas.filter((manga) => {
        const coincideCategoria =
          categoria === "Todos" || manga.categorias?.nombre === categoria;

        const coincideSerie =
          serie === "Todas" || manga.series?.nombre === serie;

        // Se aceptan estas combinaciones:
        // - solo categoría
        // - solo serie
        // - ambas
        // - ninguna (muestra todos)
        return coincideCategoria && coincideSerie;
      });
    };
  }, [mangas]);

  useEffect(() => {
    setMangasFiltrados(filterMangas(categoria, serie));
  }, [categoria, serie, filterMangas]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de categoría */}
        <select
          onChange={(e) => setCategoria(e.target.value)}
          value={categoria}
          className="w-full p-2 rounded bg-white text-black shadow"
        >
          <option value="Todos">Todas las categorías</option>
          <option value="Shonen">Shonen</option>
          <option value="Shojo">Shojo</option>
          {/* Otras categorías si tienes */}
        </select>

        {/* Selector de serie */}
        <select
          onChange={(e) => setSerie(e.target.value)}
          value={serie}
          className="w-full p-2 rounded bg-white text-black shadow"
        >
          <option value="Todas">Todas las series</option>
          <option value="Naruto">Naruto</option>
          <option value="One Piece">One Piece</option>
          {/* Otras series si tienes */}
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
