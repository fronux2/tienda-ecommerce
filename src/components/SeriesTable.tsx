"use client";
import { useState } from 'react';
import { Serie } from '@/types/supabase';
import { updateSerie } from '@/lib/supabase/services/series.client';

export default function SeriesTable({ series }: { series: Serie[] }) {
  const [editando, setEditando] = useState<{ id: string; campo: string } | null>(null);
  const [valorEditado, setValorEditado] = useState<string>("");
  const [listaSeries, setListaSeries] = useState<Serie[]>(series);
  const [busqueda, setBusqueda] = useState("");

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

  // Filtrar series basadas en la búsqueda
  const seriesFiltradas = busqueda
    ? listaSeries.filter(serie => 
        serie.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        serie.id.toLowerCase().includes(busqueda.toLowerCase())
      )
    : listaSeries;

  return (
    <div className="p-4 bg-gray-50 min-h-screen min-w-screen md:mid-w-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between md:items-center mb-6 flex-col md:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Series</h1>
            <p className="text-gray-600 mt-2">Administra las series de tu catálogo</p>
          </div>          
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6 bg-white p-5 rounded-lg shadow-md">
          <div className="w-full max-w-md">
            <label htmlFor="buscar-series" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar series
            </label>
            <div className="relative flex items-center gap-4">
              <input
                type="text"
                id="buscar-series"
                placeholder="Buscar por nombre o ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {busqueda && (
                <button 
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
              <div className="bg-indigo-100 p-3 rounded-lg">
                <p className="text-indigo-800 font-medium">
                  Total de series: <span className="font-bold">{listaSeries.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seriesFiltradas.map((serie) => (
                  <tr key={serie.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <p className="truncate max-w-xs">{serie.id}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando && editando.id === serie.id && editando.campo === 'nombre' ? (
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer group flex items-center"
                          onDoubleClick={() => manejarDobleClick(serie.id, 'nombre', serie.nombre)}
                        >
                          <span className="group-hover:text-indigo-600 transition-colors">
                            {serie.nombre}
                          </span>
                          <svg 
                            className="ml-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {seriesFiltradas.length === 0 && busqueda && (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500">
                No se encontraron series para: <span className="font-semibold">"{busqueda}"</span>
              </p>
            </div>
          )}

          {seriesFiltradas.length === 0 && !busqueda && (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500 text-lg">No hay series disponibles</p>
              <button 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                onClick={() => location.reload()}
              >
                Recargar datos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}