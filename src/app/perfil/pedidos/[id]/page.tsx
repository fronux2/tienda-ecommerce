import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/formatPrice'
import EstadoBadge from '@/components/perfil/EstadoBadge'
import TimelineEstado from '@/components/perfil/TimelineEstado'
import type { Pedido, DetallePedido, Direccion, Manga } from '@/types/supabase'

type DetalleConManga = DetallePedido & { mangas: Manga | null }
type PedidoCompleto = Pedido & {
  detalle_pedidos: DetalleConManga[]
  direcciones?: Direccion | Direccion[] | null
}

export default async function DetallePedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('*, detalle_pedidos(*, mangas(*)), direcciones!pedidos_direccion_id_fkey(*)')
    .eq('id', id)
    .single()

  if (!pedido) notFound()

  const pedidoData = pedido as unknown as PedidoCompleto

  if (pedidoData.usuario_id !== user.id) redirect('/perfil/pedidos')

  const direccion = Array.isArray(pedidoData.direcciones)
    ? pedidoData.direcciones[0]
    : pedidoData.direcciones

  const metodoPagoLabels: Record<string, string> = {
    tarjeta: 'Tarjeta de Crédito',
    paypal: 'PayPal',
    transferencia: 'Transferencia Bancaria',
  }

  return (
    <div>
      <Link
        href="/perfil/pedidos"
        className="text-sm text-red-600 hover:text-red-800 mb-4 inline-block"
      >
        ← Volver a mis pedidos
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pedido #{id.slice(0, 8)}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Realizado el {new Date(pedidoData.fecha_pedido).toLocaleDateString('es-CL', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <EstadoBadge estado={pedidoData.estado} />
      </div>

      <TimelineEstado estadoActual={pedidoData.estado} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Productos</h2>
          <div className="space-y-3">
            {pedidoData.detalle_pedidos.map((detalle) => (
              <div
                key={detalle.id}
                className="flex items-center gap-4 border rounded-lg p-3"
              >
                {detalle.mangas?.imagen_portada && (
                  <Image
                    src={detalle.mangas.imagen_portada}
                    alt={detalle.mangas.titulo}
                    width={64}
                    height={80}
                    className="w-16 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{detalle.mangas?.titulo ?? 'Manga eliminado'}</p>
                  <p className="text-sm text-gray-500">Cantidad: {detalle.cantidad}</p>
                </div>
                <p className="font-semibold text-right">
                  {formatPrice(detalle.precio_unitario * detalle.cantidad)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Resumen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(pedidoData.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(pedidoData.total)}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Pago</h3>
            <p className="text-sm text-gray-600">
              {metodoPagoLabels[pedidoData.metodo_pago] || pedidoData.metodo_pago}
            </p>
          </div>

          {direccion && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Dirección de envío</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{direccion.nombre_direccion}</p>
                <p>{direccion.direccion}</p>
                <p>{direccion.ciudad}</p>
                {direccion.codigo_postal && <p>CP: {direccion.codigo_postal}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
