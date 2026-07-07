'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { formatPrice } from '@/lib/formatPrice'
import EstadoBadge from '@/components/perfil/EstadoBadge'
import type { Pedido, DetallePedido } from '@/types/supabase'

type PedidoConDetalles = Pedido & { detalle_pedidos: DetallePedido[] }

export default function MisPedidos() {
  const supabase = createClient()
  const [pedidos, setPedidos] = useState<PedidoConDetalles[]>([])
  const [filtro, setFiltro] = useState('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPedidos = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('pedidos')
        .select('*, detalle_pedidos(*)')
        .eq('usuario_id', user.id)
        .order('fecha_pedido', { ascending: false })

      setPedidos((data ?? []) as PedidoConDetalles[])
      setLoading(false)
    }

    fetchPedidos()
  }, [supabase])

  const filtrados = filtro === 'todos'
    ? pedidos
    : pedidos.filter((p) => p.estado === filtro)

  const estados = ['todos', ...new Set(pedidos.map((p) => p.estado))]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {estados.map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === estado
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {estado === 'todos' ? 'Todos' : estado.charAt(0).toUpperCase() + estado.slice(1)}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No hay pedidos que mostrar</p>
          <Link
            href="/mangas"
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((pedido) => (
            <Link
              key={pedido.id}
              href={`/perfil/pedidos/${pedido.id}`}
              className="block border rounded-lg p-4 hover:shadow-md hover:border-red-300 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(pedido.fecha_pedido).toLocaleDateString('es-CL', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <p className="font-semibold mt-1">
                    {pedido.detalle_pedidos?.length ?? 0} producto(s) — {formatPrice(pedido.total)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">ID: {pedido.id.slice(0, 8)}…</p>
                </div>
                <EstadoBadge estado={pedido.estado} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
