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
  const [valorEditado, setValorEditado] = useState<string>("");
  const [listaMangas, setListaMangas] = useState(mangas);

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | undefined) => {
    if (!id || valor === undefined) return;
    setEditando({ id, campo });
    setValorEditado(valor);
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === "Enter") {
      manejarGuardar();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2 text-gray-700">Lista de Mangas</p>
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
                {/* Autor */}
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
                {/* El resto de los campos puedes hacerlos editables igual que el título si lo deseas */}
                <td className="px-4 py-2 border">{manga.volumen}</td>
                <td className="px-4 py-2 border">{manga.descripcion}</td>
                <td className="px-4 py-2 border">${manga.precio}</td>
                <td className="px-4 py-2 border">{manga.stock}</td>
                <td className="px-4 py-2 border">{manga.isbn}</td>
                <td className="px-4 py-2 border">{manga.numero_paginas}</td>
                <td className="px-4 py-2 border">{manga.idioma}</td>
                <td className="px-4 py-2 border">{manga.fecha_publicacion}</td>
                <td className="px-4 py-2 border">{manga.estado}</td>
                <td className="px-4 py-2 border">{manga.activo ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}