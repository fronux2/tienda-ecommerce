"use client";

import getPedidos from "@/lib/supabase/services/pedidos.client";
import { updatePedido } from "@/lib/supabase/services/pedidos.client";
import { useEffect, useState } from "react";
import { type Pedido } from "@/types/supabase";

export default function Page() {
  const [editando, setEditando] = useState<{id: string, campo: string} | null>(null);
  const [valorEditado, setValorEditado] = useState<string>("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroUsuarioId, setFiltroUsuarioId] = useState<string>(""); // Estado para el filtro

  // Filtrar pedidos por usuario_id
  const pedidosFiltrados = filtroUsuarioId
    ? pedidos.filter(pedido => 
        pedido.usuario_id?.toLowerCase().includes(filtroUsuarioId.toLowerCase()))
    : pedidos;

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | undefined | number) => {
    if (!id || valor === undefined) return;
    setEditando({ id, campo });
    setValorEditado(valor.toString());
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValorEditado(e.target.value);
  };

  const manejarGuardar = async () => {
    if (!editando) return;
    try {
      await updatePedido(editando.id, { [editando.campo]: valorEditado });
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === editando.id ? { ...pedido, [editando.campo]: valorEditado } : pedido
        )
      );
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setEditando(null);
    }
  };

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement| HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      manejarGuardar();
    }
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidos = await getPedidos();
      setPedidos(pedidos);
    };
    fetchPedidos();
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Pedidos</h1>
            <p className="text-gray-600 mt-2">Administra y actualiza los pedidos de los clientes</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <p className="text-blue-800 font-medium">Total de pedidos: {pedidos.length}</p>
          </div>
        </div>

        {/* Filtro por ID de Usuario */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div className="w-full max-w-md">
              <label htmlFor="filtro-usuario" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por ID de Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="filtro-usuario"
                  placeholder="Ingresa el ID de usuario..."
                  value={filtroUsuarioId}
                  onChange={(e) => setFiltroUsuarioId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {filtroUsuarioId && (
                  <button 
                    onClick={() => setFiltroUsuarioId("")}
                    className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Mostrando: <span className="font-bold">{pedidosFiltrados.length}</span> de {pedidos.length} pedidos
              </p>
            </div>
          </div>
          
          {filtroUsuarioId && pedidosFiltrados.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                No se encontraron pedidos para el usuario con ID: <span className="font-mono font-bold">{filtroUsuarioId}</span>
              </p>
            </div>
          )}
        </div>

        {/* Tabla de Pedidos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actualización</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {pedido.usuario_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.direccion_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editando && editando.id === pedido.id && editando.campo === "total" ? (
                        <input
                          type="number"
                          className="w-24 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer"
                          onDoubleClick={() => manejarDobleClick(pedido.id, "total", pedido.total)}
                        >
                          ${pedido.total}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editando && editando.id === pedido.id && editando.campo === "estado" ? (
                        <select
                          className="w-full px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                          value={valorEditado}
                          onChange={manejarCambio}
                          onBlur={manejarGuardar}
                          onKeyDown={manejarEnter}
                          autoFocus
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="procesando">Procesando</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      ) : (
                        <div 
                          className={`text-sm font-medium px-2 py-1 rounded-full inline-block cursor-pointer ${
                            pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            pedido.estado === 'procesando' ? 'bg-blue-100 text-blue-800' :
                            pedido.estado === 'enviado' ? 'bg-indigo-100 text-indigo-800' :
                            pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}
                          onDoubleClick={() => manejarDobleClick(pedido.id, "estado", pedido.estado)}
                        >
                          {pedido.estado}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editando && editando.id === pedido.id && editando.campo === "metodo_pago" ? (
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
                          onDoubleClick={() => manejarDobleClick(pedido.id, "metodo_pago", pedido.metodo_pago)}
                        >
                          {pedido.metodo_pago}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {editando && editando.id === pedido.id && editando.campo === "notas_pedido" ? (
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
                          onDoubleClick={() => manejarDobleClick(pedido.id, "notas_pedido", pedido.notas_pedido)}
                          title={pedido.notas_pedido || ''}
                        >
                          {pedido.notas_pedido}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.fecha_pedido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.fecha_actualizacion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pedidosFiltrados.length === 0 && !filtroUsuarioId && (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500 text-lg">No hay pedidos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}