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

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | undefined | number) => {
    if (!id || valor === undefined) return;
    setEditando({ id, campo });
    setValorEditado(valor);
  };

  const manejarCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValorEditado(e.target.value);
  };

  const manejarGuardar = async () => {
    if (!editando) return;
    try {
      await updateManga(editando.id, { [editando.campo]: valorEditado });
      setListaMangas((prev) =>
        prev.map((manga) =>
          manga.id === editando.id ? { ...manga, [editando.campo]: valorEditado } : manga
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
    <div className="p-4">
      <div className="rounded-lg border border-gray-300 shadow">
        <table className="min-w-full w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Título</th>
              <th className="px-4 py-2 border">Autor</th>
              <th className="px-4 py-2 border">Editorial</th>
              <th className="px-4 py-2 border">Categoría</th>
              <th className="px-4 py-2 border">Serie</th>
              <th className="px-4 py-2 border">Volumen</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Precio</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">URL de portada</th>
              <th className="px-4 py-2 border">ISBN</th>
              <th className="px-4 py-2 border">Páginas</th>
              <th className="px-4 py-2 border">Idioma</th>
              <th className="px-4 py-2 border">Publicación</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Activo</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {listaMangas.map((manga) => (
              <tr key={manga.id}>
                <td className="px-4 py-2 border">{manga.id}</td>
                {/* Título */}
                <td
                  onDoubleClick={() => manejarDobleClick(manga.id, "titulo", manga.titulo)}
                  className="px-4 py-2 border"
                >
                  {editando && editando.id === manga.id && editando.campo === "titulo" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.titulo
                  )}
                </td>
                <td
                  onDoubleClick={() => manejarDobleClick(manga.id, "autor", manga.autor)}
                  className="px-4 py-2 border"
                >
                  {editando && editando.id === manga.id && editando.campo === "autor" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.autor
                  )}
                </td>
                {/* Editorial */}
                <td
                  onDoubleClick={() => manejarDobleClick(manga.id, "editorial", manga.editorial)}
                  className="px-4 py-2 border"
                >
                  {editando && editando.id === manga.id && editando.campo === "editorial" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.editorial
                  )}
                </td>
                {/* Categoría */}
                <td
                  onDoubleClick={() => manejarDobleClick(manga.id, "categoria_id", manga.categoria_id)}
                  className="px-4 py-2 border"
                >
                  {editando && editando.id === manga.id && editando.campo === "categoria_id" ? (
                    <select
                      className="w-full px-2 py-1 border rounded"
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
                    categorias.find((cat) => cat.id === manga.categoria_id)?.nombre || manga.categoria_id
                  )}
                </td>
                {/* Serie */}
                <td
                  onDoubleClick={() => manejarDobleClick(manga.id, "serie_id", manga.serie_id)}
                  className="px-4 py-2 border"
                >
                  {editando && editando.id === manga.id && editando.campo === "serie_id" ? (
                    <select
                      className="w-full px-2 py-1 border rounded"
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
                    series.find((ser) => ser.id === manga.serie_id)?.nombre || manga.serie_id
                  )}
                </td>                
                <td
                  onDoubleClick={() => manejarDobleClick(manga.id, "volumen", manga.volumen)}
                  className="px-4 py-2 border"
                >
                  {editando && editando.id === manga.id && editando.campo === "volumen" ? (
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.volumen
                  )}
                </td>
                <td
                  onDoubleClick={() => manejarDobleClick(manga.id, "descripcion", manga.descripcion)}
                  className="px-4 py-2 border"
                  >
                  {editando && editando.id === manga.id && editando.campo === "descripcion" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.descripcion
                  )}
                </td>

                <td
                  onDoubleClick={() => manejarDobleClick(manga.id, "precio", manga.precio)}
                 className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "precio" ? (
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.precio
                  )}
                </td>
                <td
                onDoubleClick={() => manejarDobleClick(manga.id, "stock", manga.stock)}
                className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "stock" ? (
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.stock
                  )}
                </td>
                <td
                onDoubleClick={() => manejarDobleClick(manga.id, "imagen_portada", manga.imagen_portada)}
                className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "imagen_portada" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.imagen_portada
                  )}
                </td>
                <td
                onDoubleClick={() => manejarDobleClick(manga.id, "isbn", manga.isbn)}
                className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "isbn" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.isbn
                  )}
                </td>
                <td
                onDoubleClick={() => manejarDobleClick(manga.id, "numero_paginas", manga.numero_paginas)}
                className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "numero_paginas" ? (
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.numero_paginas
                  )}
                </td>
                <td
                onDoubleClick={() => manejarDobleClick(manga.id, "idioma", manga.idioma)}
                className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "idioma" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.idioma
                  )}
                </td>
                <td
                onDoubleClick={() => manejarDobleClick(manga.id, "fecha_publicacion", manga.fecha_publicacion)}
                className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "fecha_publicacion" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.fecha_publicacion
                  )}
                </td>
                <td
                onDoubleClick={() => manejarDobleClick(manga.id, "estado", manga.estado)}
                className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "estado" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.estado
                  )}
                </td>
                <td
                onDoubleClick={() => manejarDobleClick(manga.id, "activo", manga.activo ? "1" : "0")}
                className="px-4 py-2 border">
                  {editando && editando.id === manga.id && editando.campo === "activo" ? (
                    <input
                      type="checkbox"
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    manga.activo ? "Sí" : "No"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}