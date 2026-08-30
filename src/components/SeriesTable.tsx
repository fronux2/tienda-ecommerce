"use client";
import { useState, useRef } from 'react';
import { Serie } from '@/types/supabase';
import { updateSerie } from '@/lib/supabase/services/series.client';
import EditableCell from '@/components/EditableCell';
import LoadingButton from '@/components/LoadingButton';

export default function SeriesTable({ series }: { series: Serie[] }) {
  const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null);
  const [valorEditado, setValorEditado] = useState<string>("");
  const [listaSeries, setListaSeries] = useState<Serie[]>(series);
  const [busqueda, setBusqueda] = useState("");
  const guardandoRef = useRef(false)

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | undefined) => {
    if (!id || valor === undefined) return;
    setEditando({ id, campo });
    setValorEditado(valor);
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValorEditado(e.target.value);
  };

  const manejarGuardar = async () => {
    if (!editando || guardandoRef.current) return;
    guardandoRef.current = true;
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
      guardandoRef.current = false;
    }
  };

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      manejarGuardar();
    }
  };

  // Filtrar series basadas en la búsqueda
  const seriesFiltradas = busqueda
    ? listaSeries.filter(serie => 
        serie.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        serie.id.toLowerCase().includes(busqueda.toLowerCase())
      )
    : listaSeries;

  return (
    <div className="p-4 bg-surface-alt min-h-screen min-w-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-text">Panel de Series</h1>
            <p className="text-text-secondary mt-2">Administra las series de tu catálogo</p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6 bg-surface p-5 rounded-lg shadow-md">
          <div className="w-full max-w-md">
            <label htmlFor="buscar-series" className="block text-sm font-medium text-text-secondary mb-1">
              Buscar series
            </label>
            <div className="relative flex items-center gap-4">
              <input
                type="text"
                id="buscar-series"
                placeholder="Buscar por nombre o ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-2 text-text-muted hover:text-text-secondary rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
                >
                  ✕
                </button>
              )}
              <div className="bg-primary/10 p-3 rounded-lg">
                <p className="text-primary font-medium">
                  Total de series: <span className="font-bold">{listaSeries.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Nombre</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {seriesFiltradas.map((serie) => (
                  <tr key={serie.id} className="hover:bg-surface-alt">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                      <p className="truncate max-w-xs">{serie.id}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      <EditableCell
                        id={serie.id}
                        campo="nombre"
                        valor={serie.nombre}
                        editando={editando}
                        valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(serie.id, 'nombre', serie.nombre)}
                        onChange={manejarCambio}
                        onSave={manejarGuardar}
                        onEnter={manejarEnter}
                      >
                        <span className="group-hover:text-primary transition-colors">
                          {serie.nombre}
                        </span>
                        <svg
                          className="ml-2 h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </EditableCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {seriesFiltradas.length === 0 && busqueda && (
            <div className="text-center py-10 bg-surface-alt">
              <p className="text-text-muted">
                No se encontraron series para: <span className="font-semibold">&quot;{busqueda}&quot;</span>
              </p>
            </div>
          )}

          {seriesFiltradas.length === 0 && !busqueda && (
            <div className="text-center py-10 bg-surface-alt">
              <p className="text-text-muted text-lg">No hay series disponibles</p>
              <LoadingButton
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => location.reload()}
              >
                Recargar datos
              </LoadingButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}