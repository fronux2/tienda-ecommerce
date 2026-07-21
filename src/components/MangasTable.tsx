"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { updateManga } from "@/lib/supabase/services/mangas.client";
import { useMangaStore } from "@/store/mangaStore";
import { formatPrice } from "@/lib/formatPrice";
import EditableCell from "@/components/EditableCell";

type Serie = { id: string; nombre: string };
type Categoria = { id: string; nombre: string };

export default function MangasTable({
  series,
  categorias,
}: {
  series: Serie[];
  categorias: Categoria[];
}) {
  const mangas = useMangaStore((s) => s.mangas);
  const loadMangas = useMangaStore((s) => s.loadMangas);
  const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null);
  const [valorEditado, setValorEditado] = useState<string | number>("");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroSerie, setFiltroSerie] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<string>("");
  const [filtroPopular, setFiltroPopular] = useState<string>("");
  const [sortPor, setSortPor] = useState("titulo");
  const [sortDir, setSortDir] = useState("asc");
  const guardandoRef = useRef(false)

  useEffect(() => {
    loadMangas();
  }, [loadMangas]);

  const mangasFiltrados = useMemo(() => {
    let resultado = [...mangas];

    if (terminoBusqueda) {
      const termino = terminoBusqueda.toLowerCase();
      resultado = resultado.filter(manga => {
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
    }

    if (filtroCategoria) {
      resultado = resultado.filter(manga => manga.categoria_id === filtroCategoria);
    }

    if (filtroSerie) {
      resultado = resultado.filter(manga => manga.serie_id === filtroSerie);
    }

    if (filtroEstado) {
      resultado = resultado.filter(manga => manga.estado === filtroEstado);
    }

    if (filtroActivo !== "") {
      resultado = resultado.filter(manga => manga.activo === (filtroActivo === "true"));
    }

    if (filtroPopular !== "") {
      resultado = resultado.filter(manga => manga.es_popular === (filtroPopular === "true"));
    }

    resultado.sort((a, b) => {
      let cmp = 0;
      switch (sortPor) {
        case "titulo": cmp = (a.titulo ?? "").localeCompare(b.titulo ?? ""); break;
        case "precio": cmp = (a.precio ?? 0) - (b.precio ?? 0); break;
        case "stock": cmp = (a.stock ?? 0) - (b.stock ?? 0); break;
        case "volumen": cmp = Number(a.volumen ?? 0) - Number(b.volumen ?? 0); break;
        case "fecha_publicacion": cmp = (a.fecha_publicacion ?? "").localeCompare(b.fecha_publicacion ?? ""); break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return resultado;
  }, [mangas, terminoBusqueda, filtroCategoria, filtroSerie, filtroEstado, filtroActivo, filtroPopular, sortPor, sortDir, categorias, series]);

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
    if (!editando || guardandoRef.current) return;
    guardandoRef.current = true;
    
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
      await loadMangas(); // Recargamos los mangas para reflejar los cambios
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setEditando(null);
      guardandoRef.current = false;
    }
  };

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      manejarGuardar();
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen min-w-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="flex md:justify-between flex-col md:flex-row items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Mangas</h1>
            <p className="text-gray-600 mt-2">Administra y actualiza tu catálogo de mangas</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <p className="text-purple-800 font-medium">
              Total de mangas: <span className="font-bold">{mangasFiltrados.length}</span>
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar en toda la tabla
              </label>
              <input
                type="text"
                id="busqueda"
                placeholder="Título, autor, editorial, ISBN, categoría, serie, estado..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="filtro-categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="filtro-categoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filtro-serie" className="block text-sm font-medium text-gray-700 mb-1">
                Serie
              </label>
              <select
                id="filtro-serie"
                value={filtroSerie}
                onChange={(e) => setFiltroSerie(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                {series.map((ser) => (
                  <option key={ser.id} value={ser.id}>{ser.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label htmlFor="filtro-estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="disponible">Disponible</option>
                <option value="agotado">Agotado</option>
              </select>
            </div>
            <div>
              <label htmlFor="filtro-activo" className="block text-sm font-medium text-gray-700 mb-1">
                Activo
              </label>
              <select
                id="filtro-activo"
                value={filtroActivo}
                onChange={(e) => setFiltroActivo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="filtro-popular" className="block text-sm font-medium text-gray-700 mb-1">
                Popular
              </label>
              <select
                id="filtro-popular"
                value={filtroPopular}
                onChange={(e) => setFiltroPopular(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort-por" className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                id="sort-por"
                value={sortPor}
                onChange={(e) => setSortPor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="titulo">Título</option>
                <option value="precio">Precio</option>
                <option value="stock">Stock</option>
                <option value="volumen">Volumen</option>
                <option value="fecha_publicacion">Fecha publicación</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort-dir" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <select
                id="sort-dir"
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {terminoBusqueda && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Buscando: &quot;{terminoBusqueda}&quot;
                  <button onClick={() => setTerminoBusqueda("")} className="ml-2 hover:text-blue-600">✕</button>
                </span>
              )}
              {filtroCategoria && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {categorias.find(c => c.id === filtroCategoria)?.nombre || filtroCategoria}
                  <button onClick={() => setFiltroCategoria("")} className="ml-2 hover:text-purple-600">✕</button>
                </span>
              )}
              {filtroSerie && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                  {series.find(s => s.id === filtroSerie)?.nombre || filtroSerie}
                  <button onClick={() => setFiltroSerie("")} className="ml-2 hover:text-indigo-600">✕</button>
                </span>
              )}
              {filtroEstado && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  Estado: {filtroEstado}
                  <button onClick={() => setFiltroEstado("")} className="ml-2 hover:text-orange-600">✕</button>
                </span>
              )}
              {filtroActivo !== "" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Activo: {filtroActivo === "true" ? "Sí" : "No"}
                  <button onClick={() => setFiltroActivo("")} className="ml-2 hover:text-green-600">✕</button>
                </span>
              )}
              {filtroPopular !== "" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800">
                  Popular: {filtroPopular === "true" ? "Sí" : "No"}
                  <button onClick={() => setFiltroPopular("")} className="ml-2 hover:text-pink-600">✕</button>
                </span>
              )}
            </div>
            
            <div className="bg-green-50 px-4 py-2 rounded-lg whitespace-nowrap">
              <p className="text-sm font-medium text-green-800">
                Mostrando: <span className="font-bold">{mangasFiltrados.length}</span> de {mangas.length} mangas
              </p>
            </div>
          </div>
          
          {terminoBusqueda && mangasFiltrados.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                No se encontraron resultados para: <span className="font-mono font-bold">{terminoBusqueda}</span>
              </p>
            </div>
          )}
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
                      <EditableCell
                        id={manga.id} campo="titulo" valor={manga.titulo}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "titulo", manga.titulo)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                      >
                        {manga.titulo}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        id={manga.id} campo="autor" valor={manga.autor}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "autor", manga.autor)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                      >
                        {manga.autor}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        id={manga.id} campo="editorial" valor={manga.editorial}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "editorial", manga.editorial)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                      >
                        {manga.editorial}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        id={manga.id} campo="categoria_id" valor={manga.categoria_id}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "categoria_id", manga.categoria_id)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="select"
                        opciones={categorias.map((cat) => ({ value: cat.id, label: cat.nombre }))}
                      >
                        {categorias.find((cat) => cat.id === manga.categoria_id)?.nombre || manga.categoria_id}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        id={manga.id} campo="serie_id" valor={manga.serie_id}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "serie_id", manga.serie_id)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="select"
                        opciones={series.map((ser) => ({ value: ser.id, label: ser.nombre }))}
                      >
                        {series.find((ser) => ser.id === manga.serie_id)?.nombre || manga.serie_id}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      <EditableCell
                        id={manga.id} campo="volumen" valor={manga.volumen}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "volumen", manga.volumen)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="number" inputClassName="w-16 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <div className="cursor-pointer bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                          {manga.volumen}
                        </div>
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <EditableCell
                        id={manga.id} campo="descripcion" valor={manga.descripcion}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "descripcion", manga.descripcion)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="textarea"
                      >
                        <div className="cursor-pointer truncate" title={manga.descripcion || ''}>
                          {manga.descripcion}
                        </div>
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-700">
                      <EditableCell
                        id={manga.id} campo="precio" valor={manga.precio}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "precio", manga.precio)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="number" inputClassName="w-20 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        {formatPrice(manga.precio)}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <EditableCell
                        id={manga.id} campo="stock" valor={manga.stock}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "stock", manga.stock)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="number" inputClassName="w-20 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <div className={`cursor-pointer px-2 py-1 rounded-full font-medium ${
                          manga.stock > 10 ? 'bg-green-100 text-green-800' : 
                          manga.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {manga.stock}
                        </div>
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs">
                      <EditableCell
                        id={manga.id} campo="imagen_portada" valor={manga.imagen_portada}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "imagen_portada", manga.imagen_portada)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                      >
                        <div className="cursor-pointer truncate text-blue-600 underline" title={manga.imagen_portada || ''}>
                          {manga.imagen_portada?.substring(0, 20)}...
                        </div>
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        id={manga.id} campo="isbn" valor={manga.isbn}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "isbn", manga.isbn)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                      >
                        {manga.isbn}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <EditableCell
                        id={manga.id} campo="numero_paginas" valor={manga.numero_paginas}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "numero_paginas", manga.numero_paginas)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="number" inputClassName="w-16 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        {manga.numero_paginas}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        id={manga.id} campo="idioma" valor={manga.idioma}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "idioma", manga.idioma)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                      >
                        {manga.idioma}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        id={manga.id} campo="fecha_publicacion" valor={manga.fecha_publicacion}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "fecha_publicacion", manga.fecha_publicacion)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                      >
                        {manga.fecha_publicacion}
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableCell
                        id={manga.id} campo="estado" valor={manga.estado}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "estado", manga.estado)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                      >
                        <div className={`cursor-pointer text-sm font-medium px-2 py-1 rounded-full inline-block ${
                          manga.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                          manga.estado === 'agotado' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {manga.estado}
                        </div>
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableCell
                        id={manga.id} campo="activo" valor={manga.activo}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "activo", manga.activo)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="select" opciones={[{ value: "true", label: "Sí" }, { value: "false", label: "No" }]}
                      >
                        <div className={`cursor-pointer text-sm font-medium px-2 py-1 rounded-full inline-block ${
                          manga.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {manga.activo ? "Sí" : "No"}
                        </div>
                      </EditableCell>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableCell
                        id={manga.id} campo="es_popular" valor={manga.es_popular}
                        editando={editando} valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(manga.id, "es_popular", manga.es_popular)}
                        onChange={manejarCambio} onSave={manejarGuardar} onEnter={manejarEnter}
                        tipo="select" opciones={[{ value: "true", label: "Sí" }, { value: "false", label: "No" }]}
                      >
                        <div className={`cursor-pointer text-sm font-medium px-2 py-1 rounded-full inline-block ${
                          manga.es_popular ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {manga.es_popular ? "Sí" : "No"}
                        </div>
                      </EditableCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {mangasFiltrados.length === 0 && !terminoBusqueda && !filtroCategoria && !filtroSerie && !filtroEstado && !filtroActivo && !filtroPopular && (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500 text-lg">No hay mangas disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}