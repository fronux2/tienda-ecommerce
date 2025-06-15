"use client";

import  getPedidos  from "@/lib/supabase/services/pedidos.client";
import { updatePedido } from "@/lib/supabase/services/pedidos.client";
import { useEffect, useState } from "react";
import { type Pedido } from "@/types/supabase";
export default function Page() {
  const [editando, setEditando] = useState<{id: string, campo: string} | null>(null)
  const [valorEditado, setValorEditado] = useState<string>("")
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const manejarDobleClick = (id: string | undefined, campo: string, valor: string | undefined | number) => {
    if (!id || valor === undefined) return;
    setEditando({ id, campo });
    setValorEditado(valor);
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValorEditado(e.target.value);
  };

  const manejarGuardar = async () => {
    if (!editando) return;
    try {
      console.log('awrawfa ',editando ,valorEditado)
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
    <div className="p-4">
        <h2 className="mb-2 text-gray-700 text-2xl font-bold">Tabla de Lista de Pedidos</h2>  
        <table className="min-w-full w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Usuario</th>
              <th className="px-4 py-2 border">Dirección</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Metodo de Pago</th>
              <th className="px-4 py-2 border">Notas</th>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Fecha Actualización</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {
              pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="px-4 py-2 border" onDoubleClick={() => manejarDobleClick(pedido.id, "id", pedido.id)}>{pedido.id}</td>
                  <td className="px-4 py-2 border">{pedido.usuario_id}</td>
                  <td className="px-4 py-2 border" onDoubleClick={() => manejarDobleClick(pedido.id, "direccion_id", pedido.direccion_id)}>{pedido.direccion_id}</td>
                  <td className="px-4 py-6 border" onDoubleClick={() => manejarDobleClick(pedido.id, "total", pedido.total)}>{
                    editando && editando && editando.id === pedido.id && editando.campo === "total" ? (
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
                      <p className="w-24">{pedido.total}</p>
                    )}
                  </td>
                  <td className="px-4 py-2 border" onDoubleClick={() => manejarDobleClick(pedido.id, "estado", pedido.estado)}>{
                    editando && editando.id === pedido.id && editando.campo === "estado" ? (
                      <select
                        className="w-full px-2 py-1 border rounded"
                        value={valorEditado}
                        onChange={manejarCambio}
                        onBlur={manejarGuardar}
                        onKeyDown={manejarEnter}
                        autoFocus
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="procesando">Procesando</option>
                        <option value="enviado">enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    ) : (

                      <p className="w-28">{pedido.estado}</p>
                    )}
                    </td>
                  <td className="px-4 py-2 border" onDoubleClick={() => manejarDobleClick(pedido.id, "metodo_pago", pedido.metodo_pago)}>{
                    editando && editando && editando.id === pedido.id && editando.campo === "metodo_pago" ? (
                      <input
                        className="w-full px-2 py-1 border rounded"
                        value={valorEditado}
                        onChange={manejarCambio}
                        onBlur={manejarGuardar}
                        onKeyDown={manejarEnter}
                        autoFocus
                      />
                    ) : (
                      pedido.metodo_pago
                    )}
                  </td>
                  <td className="px-4 py-2 border" onDoubleClick={() => manejarDobleClick(pedido.id, "notas_pedido", pedido.notas_pedido)}>{pedido.notas_pedido}</td>
                  <td className="px-4 py-2 border" onDoubleClick={() => manejarDobleClick(pedido.id, "fecha_pedido", pedido.fecha_pedido)}>{pedido.fecha_pedido}</td>
                  <td className="px-4 py-2 border" onDoubleClick={() => manejarDobleClick(pedido.id, "fecha_actualizacion", pedido.fecha_actualizacion)}>{pedido.fecha_actualizacion}</td>                  
                </tr>
              ))
            }
          </tbody>
        </table>

       

    </div>
  );
}