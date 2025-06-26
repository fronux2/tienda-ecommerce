"use client";
import { useState } from "react";
import { updateManga } from "@/lib/supabase/services/mangas.client";
import { type UpdateManga } from "@/types/supabase";

type Serie = { id: string; nombre: string };
type Categoria = { id: string; nombre: string };

export default function MangasTable({
  mangas,
  series,
  categorias,
}: {
  mangas: UpdateManga[];
  series: Serie[];
  categorias: Categoria[];
}) {
  const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null);
  const [valorEditado, setValorEditado] = useState<string | number>("");
  const [listaMangas, setListaMangas] = useState(mangas);

  const manejarDobleClick = (id: string | undefined, campo: string, valor: any ) => {
    if (!id || valor === undefined) return;
    
    // Convertir valores booleanos a string para inputs
    if (campo === "activo" || campo === "es_popular") {
      setValorEditado(valor.toString()); // "true" o "false"
    } else {
      setValorEditado(valor);
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
    
    let valorFinal: any = valorEditado;
    
    // Convertir campos booleanos
    if (editando.campo === "es_popular" || editando.campo === "activo") {
      valorFinal = valorEditado === "true"; // Convertir a booleano
    }
    // Convertir campos numéricos
    else if (editando.campo === "volumen" || 
             editando.campo === "precio" || 
             editando.campo === "stock" || 
             editando.campo === "numero_paginas") {
      valorFinal = Number(valorEditado);
    }

    try {
      await updateManga(editando.id, { [editando.campo]: valorFinal });
      
      setListaMangas(prev => 
        prev.map(manga => 
          manga.id === editando.id 
            ? { ...manga, [editando.campo]: valorFinal } 
            : manga
        )
      );
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
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Mangas</h1>
            <p className="text-gray-600 mt-2">Administra y actualiza tu catálogo de mangas</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-lg">
            <p className="text-purple-800 font-medium">
              Total de mangas: <span className="font-bold">{listaMangas.length}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
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
                {listaMangas.map((manga) => (
                  <tr key={manga.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <p className="truncate max-w-xs">{manga.id}</p>
                    </td>
                    
                    {/* Título */}
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
                    
                    {/* Autor */}
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
                    
                    {/* Editorial */}
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
                    
                    {/* Categoría */}
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
                    
                    {/* Serie */}
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
                    
                    {/* Volumen */}
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
                    
                    {/* Descripción */}
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
                    
                    {/* Precio */}
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
                    
                    {/* Stock */}
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
                    
                    {/* URL de portada */}
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
                    
                    {/* ISBN */}
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
                    
                    {/* Páginas */}
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
                    
                    {/* Idioma */}
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
                    
                    {/* Fecha Publicación */}
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
                    
                    {/* Estado */}
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
                    
                    {/* Activo */}
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
                    
                    {/* Es popular */}
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
          
          {listaMangas.length === 0 && (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500 text-lg">No hay mangas disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}