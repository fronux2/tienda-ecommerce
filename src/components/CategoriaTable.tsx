"use client"
import { useState } from "react";
import { type Categoria } from "@/types/supabase";
import { updateCategoria } from "@/lib/supabase/services/categorias.client";

export default function CategoriaTable({ categorias }: { categorias: Categoria[] }) {
  const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null);
  const [valorEditado, setValorEditado] = useState<string>("");
  const [listaCategorias, setListaCategorias] = useState(categorias);

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | undefined) => {
    if (!id || valor === undefined) return;
    setEditando({ id, campo });
    setValorEditado(valor);
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorEditado(e.target.value);
  };

  const manejarGuardar = async () => {
    if (!editando) return;
    try {
      await updateCategoria(editando.id, { [editando.campo]: valorEditado });
      setListaCategorias((prev) =>
        prev.map((categoria) =>
          categoria.id === editando.id ? { ...categoria, [editando.campo]: valorEditado } : categoria
        )
      );
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setEditando(null);
    }
  };

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      manejarGuardar();
    }
  };

  return (
    <div className="p-4 min-h-screen min-w-screen md:mid-w-auto">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2 text-gray-700">Lista de Categorias</p>
      <div className="rounded-lg border border-gray-300 shadow">
        <table className="min-w-full w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {listaCategorias.map((categoria) => (
              <tr key={categoria.id}>
                <td className="px-4 py-2 border">{categoria.id}</td>
                {/* Nombre */}
                <td
                  onDoubleClick={() => manejarDobleClick(categoria.id, "nombre", categoria.nombre)}
                  className="px-4 py-2 border"
                >
                  {editando && editando.id === categoria.id && editando.campo === "nombre" ? (
                    <input
                      className="w-full px-2 py-1 border rounded"
                      value={valorEditado}
                      onChange={manejarCambio}
                      onBlur={manejarGuardar}
                      onKeyDown={manejarEnter}
                      autoFocus
                    />
                  ) : (
                    categoria.nombre
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