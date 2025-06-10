"use client";
import {useState} from 'react';
import { Serie } from '@/types/supabase';
import { updateSerie } from '@/lib/supabase/services/series.client';
export default function SeriesTable({series}: {series: Serie[]}) {
    const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null);
    const [valorEditado, setValorEditado] = useState<string>("");
    const [listaSeries, setListaSeries] = useState<Serie[]>(series);

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
      await updateSerie(editando.id, { [editando.campo]: valorEditado });
      setListaSeries((prev) =>
        prev.map((serie) =>
          serie.id === editando.id ? { ...serie, [editando.campo]: valorEditado } : serie
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2 text-gray-700">Lista de Serie</p>
      <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
            </tr>
        </thead>
        <tbody>
            {listaSeries.map((serie) => (
                <tr key={serie.id}>
                    <td>{serie.id}</td>
                    <td onDoubleClick={() => manejarDobleClick(serie.id, 'nombre', serie.nombre)}>
                        {editando && editando.id === serie.id && editando.campo === 'nombre' ? (
                            <input
                                className="w-full px-2 py-1 border rounded"
                                value={valorEditado}
                                onChange={manejarCambio}
                                onBlur={manejarGuardar}
                                onKeyDown={manejarEnter}
                                autoFocus
                            />
                        ) : (
                            serie.nombre
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  )}