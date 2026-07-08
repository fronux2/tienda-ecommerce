"use client"
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

const SNAPSHOT_KEY = 'webpay_pending_order'

type WebpaySnapshot = {
  items: Array<{
    manga_id: string
    cantidad: number
    precio: number
    titulo: string
  }>
  total: number
  direccion_id: string
  direccionStr: string
  userEmail: string
  buyOrder: string
}

function WebpayResultadoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const procesar = async () => {
      const token_ws = searchParams.get('token_ws')
      if (!token_ws) {
        setStatus('error')
        setErrorMsg('No se recibió el token de pago')
        return
      }

      try {
        const res = await fetch('/api/webpay/commit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token_ws }),
        })

        const result = await res.json()

        if (result.status !== 'AUTHORIZED') {
          setStatus('error')
          setErrorMsg(
            result.status === 'REJECTED'
              ? 'La transacción fue rechazada'
              : 'La transacción no pudo ser completada'
          )
          return
        }

        const snapshotJson = localStorage.getItem(SNAPSHOT_KEY)
        if (!snapshotJson) {
          setStatus('error')
          setErrorMsg('No se encontraron datos del pedido')
          return
        }

        const snapshot: WebpaySnapshot = JSON.parse(snapshotJson)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setStatus('error')
          setErrorMsg('Usuario no autenticado')
          return
        }

        const { data: order, error: orderError } = await supabase
          .from('pedidos')
          .insert([{
            usuario_id: user.id,
            direccion_id: snapshot.direccion_id,
            total: snapshot.total,
            metodo_pago: 'webpay',
            estado: 'procesando',
            webpay_token: token_ws,
            buy_order: snapshot.buyOrder,
          }])
          .select('*')

        if (orderError) throw orderError

        const orderDetails = snapshot.items.map(item => ({
          pedido_id: order[0].id,
          manga_id: item.manga_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        }))

        const { error: detailsError } = await supabase
          .from('detalle_pedidos')
          .insert(orderDetails)

        if (detailsError) throw detailsError

        const stockUpdates = snapshot.items.map(item =>
          supabase.rpc('decrement_stock', {
            manga_id: item.manga_id,
            decrement_by: item.cantidad,
          })
        )

        await Promise.all(stockUpdates)

        await supabase
          .from('carrito')
          .update({ checked_out: true, fecha_checkout: new Date() })
          .eq('usuario_id', user.id)
          .eq('checked_out', false)

        localStorage.removeItem(SNAPSHOT_KEY)

        const emailItems = snapshot.items.map(item => ({
          nombre: item.titulo,
          cantidad: item.cantidad,
          precio: item.precio,
        }))

        fetch('/api/enviar-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pedido-confirmado',
            to: snapshot.userEmail,
            data: {
              pedidoId: order[0].id,
              items: emailItems,
              total: snapshot.total,
              direccion: snapshot.direccionStr,
              fecha: new Date().toLocaleDateString('es-CL'),
            },
          }),
        }).catch(() => {})

        fetch('/api/enviar-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pedido-recibido-admin',
            to: '',
            data: {
              pedidoId: order[0].id,
              clienteEmail: snapshot.userEmail,
              items: emailItems,
              total: snapshot.total,
              direccion: snapshot.direccionStr,
              fecha: new Date().toLocaleDateString('es-CL'),
            },
          }),
        }).catch(() => {})

        setStatus('success')
        setTimeout(() => {
          router.push('/perfil/pedidos/' + order[0].id)
        }, 1500)

      } catch (error) {
        console.error('Webpay resultado error:', error)
        setStatus('error')
        setErrorMsg('Error al procesar el pago')
      }
    }

    procesar()
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Procesando tu pago...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
        <p className="text-gray-600">Redirigiendo a tu pedido...</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="text-red-600 text-6xl mb-4">✕</div>
      <h1 className="text-2xl font-bold mb-2">Error en el pago</h1>
      <p className="text-gray-600 mb-6">{errorMsg}</p>
      <Link
        href="/cart"
        className="inline-block px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Volver al carrito
      </Link>
    </div>
  )
}

export default function WebpayResultadoPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto mt-20 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Procesando tu pago...</p>
      </div>
    }>
      <WebpayResultadoContent />
    </Suspense>
  )
}
