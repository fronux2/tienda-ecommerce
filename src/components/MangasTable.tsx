"use client";
import { useState, useMemo, useEffect } from "react";
import { updateManga } from "@/lib/supabase/services/mangas.client";
import { useMangaStore } from "@/store/mangaStore";

type Serie = { id: string; nombre: string };
type Categoria = { id: string; nombre: string };

export default function MangasTable({
  series,
  categorias,
}: {
  series: Serie[];
  categorias: Categoria[];
}) {
  const { mangas, loadMangas } = useMangaStore();
  const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null);
  const [valorEditado, setValorEditado] = useState<string | number>("");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  useEffect(() => {
    loadMangas();
  }, [loadMangas]);

  const mangasFiltrados = useMemo(() => {
    if (!terminoBusqueda) return mangas;
    
    const termino = terminoBusqueda.toLowerCase();
    
    return mangas.filter(manga => {
      const categoriaNombre = categorias.find(c => c.id === manga.categoria_id)?.nombre.toLowerCase();
      const serieNombre = series.find(s => s.id === manga.serie_id)?.nombre.toLowerCase();
      
      return (
        manga.titulo?.toLowerCase().includes(termino) ||
        manga.autor?.toLowerCase().includes(termino) ||
        manga.editorial?.toLowerCase().includes(termino) ||
        manga.isbn?.toLowerCase().includes(termino) ||
        manga.idioma?.toLowerCase().includes(termino) ||
        manga.estado?.toLowerCase().includes(termino) ||
        manga.descripcion?.toLowerCase().includes(termino) ||
        manga.volumen?.toString().includes(termino) ||
        manga.precio?.toString().includes(termino) ||
        manga.stock?.toString().includes(termino) ||
        manga.numero_paginas?.toString().includes(termino) ||
        categoriaNombre?.includes(termino) ||
        serieNombre?.includes(termino)
      );
    });
  }, [terminoBusqueda, mangas, categorias, series]);

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | number | boolean | undefined) => {
    if (!id || valor === undefined) return;
    
    if (campo === "activo" || campo === "es_popular") {
      setValorEditado(String(valor));
    } else {
      setValorEditado(valor as string | number);
    }
    
    setEditando({ id, campo });
  };

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValorEditado(e.target.value);
  };

  const manejarGuardar = async () => {
    if (!editando) return;
    
    let valorFinal: string | number | boolean = valorEditado;
    
    if (editando.campo === "es_popular" || editando.campo === "activo") {
      valorFinal = valorEditado === "true";
    } else if (editando.campo === "volumen" || 
             editando.campo === "precio" || 
             editando.campo === "stock" || 
             editando.campo === "numero_paginas") {
      valorFinal = Number(valorEditado);
    }

    try {
      await updateManga(editando.id, { [editando.campo]: valorFinal });
      
      // No necesitamos actualizar el estado local ya que Zustand manejará esto
      // cuando se recarguen los mangas
      loadMangas(); // Recargamos los mangas para reflejar los cambios
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setEditando(null);
    }
  };

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      manejarGuardar();
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen min-w-screen md:mid-w-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex md:justify-between flex-col md:flex-row items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Mangas</h1>
            <p className="text-gray-600 mt-2">Administra y actualiza tu catálogo de mangas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar mangas..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <p className="text-purple-800 font-medium">
                Total de mangas: <span className="font-bold">{mangasFiltrados.length}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-200px)] scroll-smooth">
            <table className="min-w-full w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editorial</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Págs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idioma</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popular</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mangasFiltrados.map((manga) => (
                  <tr key={manga.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <p className="truncate max-w-xs">{manga.id}</p>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editando?.id === manga.id && editando.campo === "titulo" ? (
                        <input
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "titulo", manga.titulo)}
                        >
                          {manga.titulo}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando?.id === manga.id && editando.campo === "autor" ? (
                        <input
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "autor", manga.autor)}
                        >
                          {manga.autor}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando?.id === manga.id && editando.campo === "editorial" ? (
                        <input
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "editorial", manga.editorial)}
                        >
                          {manga.editorial}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando?.id === manga.id && editando.campo === "categoria_id" ? (
                        <select
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        >
                          {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "categoria_id", manga.categoria_id)}
                        >
                          {categorias.find((cat) => cat.id === manga.categoria_id)?.nombre || manga.categoria_id}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando?.id === manga.id && editando.campo === "serie_id" ? (
                        <select
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        >
                          {series.map((ser) => (
                            <option key={ser.id} value={ser.id}>
                              {ser.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "serie_id", manga.serie_id)}
                        >
                          {series.find((ser) => ser.id === manga.serie_id)?.nombre || manga.serie_id}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {editando?.id === manga.id && editando.campo === "volumen" ? (
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                          onDoubleClick={() => manejarDobleClick(manga.id, "volumen", manga.volumen)}
                        >
                          {manga.volumen}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {editando?.id === manga.id && editando.campo === "descripcion" ? (
                        <textarea
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          rows={2}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer truncate"
                          onDoubleClick={() => manejarDobleClick(manga.id, "descripcion", manga.descripcion)}
                          title={manga.descripcion || ''}
                        >
                          {manga.descripcion}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                      {editando?.id === manga.id && editando.campo === "precio" ? (
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "precio", manga.precio)}
                        >
                          ${manga.precio}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {editando?.id === manga.id && editando.campo === "stock" ? (
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className={`cursor-pointer px-2 py-1 rounded-full font-medium ${
                            manga.stock > 10 ? 'bg-green-100 text-green-800' : 
                            manga.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}
                          onDoubleClick={() => manejarDobleClick(manga.id, "stock", manga.stock)}
                        >
                          {manga.stock}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs">
                      {editando?.id === manga.id && editando.campo === "imagen_portada" ? (
                        <input
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer truncate text-blue-600 underline"
                          onDoubleClick={() => manejarDobleClick(manga.id, "imagen_portada", manga.imagen_portada)}
                          title={manga.imagen_portada || ''}
                        >
                          {manga.imagen_portada?.substring(0, 20)}...
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando?.id === manga.id && editando.campo === "isbn" ? (
                        <input
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "isbn", manga.isbn)}
                        >
                          {manga.isbn}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {editando?.id === manga.id && editando.campo === "numero_paginas" ? (
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "numero_paginas", manga.numero_paginas)}
                        >
                          {manga.numero_paginas}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando?.id === manga.id && editando.campo === "idioma" ? (
                        <input
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "idioma", manga.idioma)}
                        >
                          {manga.idioma}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando?.id === manga.id && editando.campo === "fecha_publicacion" ? (
                        <input
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(manga.id, "fecha_publicacion", manga.fecha_publicacion)}
                        >
                          {manga.fecha_publicacion}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editando?.id === manga.id && editando.campo === "estado" ? (
                        <input
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className={`cursor-pointer text-sm font-medium px-2 py-1 rounded-full inline-block ${
                            manga.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                            manga.estado === 'agotado' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                          onDoubleClick={() => manejarDobleClick(manga.id, "estado", manga.estado)}
                        >
                          {manga.estado}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editando?.id === manga.id && editando.campo === "activo" ? (
                        <select
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        >
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        <div 
                          className={`cursor-pointer text-sm font-medium px-2 py-1 rounded-full inline-block ${
                            manga.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                          onDoubleClick={() => manejarDobleClick(manga.id, "activo", manga.activo)}
                        >
                          {manga.activo ? "Sí" : "No"}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editando?.id === manga.id && editando.campo === "es_popular" ? (
                        <select
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        >
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        <div 
                          className={`cursor-pointer text-sm font-medium px-2 py-1 rounded-full inline-block ${
                            manga.es_popular ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}
                          onDoubleClick={() => manejarDobleClick(manga.id, "es_popular", manga.es_popular)}
                        >
                          {manga.es_popular ? "Sí" : "No"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {mangasFiltrados.length === 0 && (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500 text-lg">
                {terminoBusqueda ? "No se encontraron mangas con ese criterio" : "No hay mangas disponibles"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}