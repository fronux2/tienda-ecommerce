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
      <p className="text-text-secondary mb-8">{user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="border border-border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-surface">
          <p className="text-sm text-text-muted">Total pedidos</p>
          <p className="text-3xl font-bold text-primary">{pedidosRecientes.length}</p>
        </div>
        <Link href="/perfil/pedidos" className="border border-border rounded-lg p-4 bg-gradient-to-br from-info/5 to-surface hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light">
          <p className="text-sm text-text-muted">Mis Pedidos</p>
          <p className="text-lg font-semibold text-info mt-2">Ver historial →</p>
        </Link>
        <Link href="/perfil/direcciones" className="border border-border rounded-lg p-4 bg-gradient-to-br from-success/5 to-surface hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light">
          <p className="text-sm text-text-muted">Direcciones</p>
          <p className="text-lg font-semibold text-success mt-2">Administrar →</p>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Últimos pedidos</h2>

      {pedidosRecientes.length === 0 ? (
        <div className="text-center py-12 bg-surface-alt rounded-lg">
          <p className="text-text-muted mb-4">Aún no has realizado ningún pedido</p>
          <Link
            href="/mangas"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
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
              className="block border border-border rounded-lg p-4 hover:shadow-md hover:border-primary-light transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-text-muted">
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
