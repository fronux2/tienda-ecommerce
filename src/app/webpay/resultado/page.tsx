"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function WebpayResultadoPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const procesar = async () => {
      const params = new URLSearchParams(window.location.search)
      const token_ws = params.get('token_ws')
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

        const { data: pedidoId, error: rpcError } = await supabase.rpc('crear_pedido_completo', {
          p_usuario_id: user.id,
          p_direccion_id: snapshot.direccion_id,
          p_total: snapshot.total,
          p_token: token_ws,
          p_buy_order: snapshot.buyOrder,
          p_items: snapshot.items.map(i => ({
            manga_id: i.manga_id,
            cantidad: i.cantidad,
          })),
        })

        if (rpcError) throw rpcError

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
              pedidoId,
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
              pedidoId,
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
          router.push('/perfil/pedidos/' + pedidoId)
        }, 1500)

      } catch (error) {
        console.error('Webpay resultado error:', error)
        setStatus('error')
        setErrorMsg('Error al procesar el pago')
      }
    }

    procesar()
  }, [router])

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
