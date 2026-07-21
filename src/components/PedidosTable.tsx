"use client";

import getPedidos from "@/lib/supabase/services/pedidos.client";
import { updatePedido } from "@/lib/supabase/services/pedidos.client";
import { useEffect, useState, useRef, useMemo } from "react";
import { type Pedido } from "@/types/supabase";
import { formatPrice } from "@/lib/formatPrice";
import EditableCell from "@/components/EditableCell";

export default function PedidosTable() {
  const [editando, setEditando] = useState<{id: string, campo: string} | null>(null);
  const [valorEditado, setValorEditado] = useState<string>("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState<string>("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState<string>("");
  const guardandoRef = useRef(false)

  const pedidosFiltrados = useMemo(() => {
    let resultado = [...pedidos];

    if (busqueda) {
      const t = busqueda.toLowerCase();
      resultado = resultado.filter((pedido) =>
        pedido.id?.toLowerCase().includes(t) ||
        pedido.usuarios?.email?.toLowerCase().includes(t) ||
        pedido.usuario_id?.toLowerCase().includes(t) ||
        `${pedido.direcciones?.nombre_direccion ?? ""} ${pedido.direcciones?.calle ?? ""} ${pedido.direcciones?.numero ?? ""} ${pedido.direcciones?.comuna ?? ""} ${pedido.direcciones?.ciudad ?? ""}`.toLowerCase().includes(t) ||
        pedido.total?.toString().includes(t) ||
        pedido.estado?.toLowerCase().includes(t) ||
        pedido.metodo_pago?.toLowerCase().includes(t) ||
        pedido.webpay_token?.toLowerCase().includes(t) ||
        pedido.buy_order?.toLowerCase().includes(t) ||
        pedido.notas_pedido?.toLowerCase().includes(t) ||
        pedido.fecha_pedido?.toLowerCase().includes(t) ||
        pedido.fecha_actualizacion?.toLowerCase().includes(t)
      );
    }

    if (filtroEstado) {
      resultado = resultado.filter((pedido) => pedido.estado === filtroEstado);
    }

    if (filtroFechaDesde) {
      const desde = new Date(filtroFechaDesde);
      resultado = resultado.filter((pedido) => new Date(pedido.fecha_pedido) >= desde);
    }

    if (filtroFechaHasta) {
      const hasta = new Date(filtroFechaHasta + "T23:59:59");
      resultado = resultado.filter((pedido) => new Date(pedido.fecha_pedido) <= hasta);
    }

    const ordenEstados: Record<string, number> = {
      pendiente: 0, procesando: 1, enviado: 2, entregado: 3, cancelado: 4,
    };

    resultado.sort((a, b) => {
      const oa = ordenEstados[a.estado] ?? 99;
      const ob = ordenEstados[b.estado] ?? 99;
      if (oa !== ob) return oa - ob;
      return new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime();
    });

    return resultado;
  }, [pedidos, busqueda, filtroEstado, filtroFechaDesde, filtroFechaHasta]);

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | undefined | number) => {
    if (!id || valor === undefined) return;
    setEditando({ id, campo });
    setValorEditado(valor.toString());
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValorEditado(e.target.value);
  };

  const manejarGuardar = async () => {
    if (!editando || guardandoRef.current) return;
    guardandoRef.current = true;
    try {
      await updatePedido(editando.id, { [editando.campo]: valorEditado });
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === editando.id ? { ...pedido, [editando.campo]: valorEditado } : pedido
        )
      );

      if (editando.campo === "estado") {
        const pedidoOriginal = pedidos.find((p) => p.id === editando.id);
        const emailCliente = pedidoOriginal?.usuarios?.email;

        if (emailCliente && pedidoOriginal?.estado !== valorEditado) {
          fetch("/api/enviar-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "pedido-actualizado",
              to: emailCliente,
              data: {
                pedidoId: editando.id,
                estadoAnterior: pedidoOriginal.estado,
                estadoNuevo: valorEditado,
                fecha: new Date().toLocaleDateString("es-CL"),
              },
            }),
          }).catch((err) => console.error("Error al enviar email:", err));
        }
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setEditando(null);
      guardandoRef.current = false;
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
    <div className="p-4 bg-gray-50 min-h-screen min-w-screen ">
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
                placeholder="ID, email, dirección, total, estado, método de pago, notas, fechas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rango de fechas
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filtroFechaDesde}
                  onChange={(e) => setFiltroFechaDesde(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  title="Desde"
                />
                <input
                  type="date"
                  value={filtroFechaHasta}
                  onChange={(e) => setFiltroFechaHasta(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  title="Hasta"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {busqueda && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Buscando: &quot;{busqueda}&quot;
                  <button onClick={() => setBusqueda("")} className="ml-2 hover:text-blue-600">✕</button>
                </span>
              )}
              {filtroEstado && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  Estado: {filtroEstado}
                  <button onClick={() => setFiltroEstado("")} className="ml-2 hover:text-purple-600">✕</button>
                </span>
              )}
              {filtroFechaDesde && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Desde: {filtroFechaDesde}
                  <button onClick={() => setFiltroFechaDesde("")} className="ml-2 hover:text-green-600">✕</button>
                </span>
              )}
              {filtroFechaHasta && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Hasta: {filtroFechaHasta}
                  <button onClick={() => setFiltroFechaHasta("")} className="ml-2 hover:text-green-600">✕</button>
                </span>
              )}
            </div>
            
            <div className="bg-green-50 px-4 py-2 rounded-lg whitespace-nowrap">
              <p className="text-sm font-medium text-green-800">
                Mostrando: <span className="font-bold">{pedidosFiltrados.length}</span> de {pedidos.length} pedidos
              </p>
            </div>
          </div>
          
          {busqueda && pedidosFiltrados.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                No se encontraron resultados para: <span className="font-mono font-bold">{busqueda}</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Webpay Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actualización</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.usuarios?.email || pedido.usuario_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.direcciones
                        ? `${pedido.direcciones.nombre_direccion} - ${pedido.direcciones.calle} #${pedido.direcciones.numero}, ${pedido.direcciones.comuna}`
                        : pedido.direccion_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <EditableCell
                        id={pedido.id}
                        campo="total"
                        valor={pedido.total}
                        editando={editando}
                        valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(pedido.id, "total", pedido.total)}
                        onChange={manejarCambio}
                        onSave={manejarGuardar}
                        onEnter={manejarEnter}
                        tipo="number"
                        inputClassName="w-24 px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        {formatPrice(pedido.total)}
                      </EditableCell>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EditableCell
                        id={pedido.id}
                        campo="estado"
                        valor={pedido.estado}
                        editando={editando}
                        valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(pedido.id, "estado", pedido.estado)}
                        onChange={manejarCambio}
                        onSave={manejarGuardar}
                        onEnter={manejarEnter}
                        tipo="select"
                        opciones={[
                          { value: "pendiente", label: "Pendiente" },
                          { value: "procesando", label: "Procesando" },
                          { value: "enviado", label: "Enviado" },
                          { value: "entregado", label: "Entregado" },
                          { value: "cancelado", label: "Cancelado" },
                        ]}
                      >
                        <div className={`text-sm font-medium px-2 py-1 rounded-full inline-block cursor-pointer ${
                          pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          pedido.estado === 'procesando' ? 'bg-blue-100 text-blue-800' :
                          pedido.estado === 'enviado' ? 'bg-indigo-100 text-indigo-800' :
                          pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pedido.estado}
                        </div>
                      </EditableCell>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        id={pedido.id}
                        campo="metodo_pago"
                        valor={pedido.metodo_pago}
                        editando={editando}
                        valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(pedido.id, "metodo_pago", pedido.metodo_pago)}
                        onChange={manejarCambio}
                        onSave={manejarGuardar}
                        onEnter={manejarEnter}
                      >
                        {pedido.metodo_pago}
                      </EditableCell>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate max-w-[120px]" title={pedido.webpay_token || ''}>
                        {pedido.webpay_token || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pedido.buy_order || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <EditableCell
                        id={pedido.id}
                        campo="notas_pedido"
                        valor={pedido.notas_pedido}
                        editando={editando}
                        valorEditado={valorEditado}
                        onDoubleClick={() => manejarDobleClick(pedido.id, "notas_pedido", pedido.notas_pedido)}
                        onChange={manejarCambio}
                        onSave={manejarGuardar}
                        onEnter={manejarEnter}
                        tipo="textarea"
                      >
                        <div className="cursor-pointer truncate" title={pedido.notas_pedido || ''}>
                          {pedido.notas_pedido}
                        </div>
                      </EditableCell>
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
          
          {pedidosFiltrados.length === 0 && !busqueda && !filtroEstado && !filtroFechaDesde && !filtroFechaHasta && (
            <div className="text-center py-10 bg-gray-50">
              <p className="text-gray-500 text-lg">No hay pedidos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}