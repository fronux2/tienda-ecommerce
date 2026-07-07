import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/formatPrice'
import { redirect } from 'next/navigation'
import EstadoBadge from '@/components/perfil/EstadoBadge'
import type { Pedido, DetallePedido } from '@/types/supabase'

type PedidoConDetalles = Pedido & { detalle_pedidos: DetallePedido[] }

export default async function PerfilDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: pedidos } = await supabase
    .from('pedidos')
    .select('*, detalle_pedidos(*)')
    .eq('usuario_id', user.id)
    .order('fecha_pedido', { ascending: false })
    .limit(3)

  const pedidosRecientes = (pedidos ?? []) as PedidoConDetalles[]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Bienvenido de nuevo</h1>
      <p className="text-gray-600 mb-8">{user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-lg p-4 bg-gradient-to-br from-red-50 to-white">
          <p className="text-sm text-gray-500">Total pedidos</p>
          <p className="text-3xl font-bold text-red-600">{pedidosRecientes.length}</p>
        </div>
        <Link href="/perfil/pedidos" className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Mis Pedidos</p>
          <p className="text-lg font-semibold text-blue-600 mt-2">Ver historial →</p>
        </Link>
        <Link href="/perfil/direcciones" className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Direcciones</p>
          <p className="text-lg font-semibold text-green-600 mt-2">Administrar →</p>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Últimos pedidos</h2>

      {pedidosRecientes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Aún no has realizado ningún pedido</p>
          <Link
            href="/mangas"
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Explorar mangas
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidosRecientes.map((pedido) => (
            <Link
              key={pedido.id}
              href={`/perfil/pedidos/${pedido.id}`}
              className="block border rounded-lg p-4 hover:shadow-md hover:border-red-300 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(pedido.fecha_pedido).toLocaleDateString('es-CL', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <p className="font-semibold mt-1">
                    {pedido.detalle_pedidos?.length ?? 0} producto(s) — {formatPrice(pedido.total)}
                  </p>
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
