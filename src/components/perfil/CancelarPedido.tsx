'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { IconoError } from '@/components/icons/estado'
import { TRANSICION_ESTADO } from '@/lib/ui/transiciones'

/**
 * Cancelacion de un pedido por parte de su dueno.
 *
 * La validacion real (que sea tuyo, que siga cancelable) vive en el RPC
 * cancelar_pedido: aca solo se decide que mostrar. Confirmacion en dos pasos en
 * vez de window.confirm, que bloquea el hilo y se ve ajeno al resto del sitio.
 */
export default function CancelarPedido({
  pedidoId,
  estado,
  emailCliente,
}: {
  pedidoId: string
  estado: string
  emailCliente?: string | null
}) {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!['pendiente', 'procesando'].includes(estado)) return null

  const cancelar = async () => {
    if (enviando) return
    setEnviando(true)
    setError(null)

    const supabase = createClient()
    const { error: rpcError } = await supabase.rpc('cancelar_pedido', {
      p_pedido_id: pedidoId,
    })

    if (rpcError) {
      setError(rpcError.message)
      setEnviando(false)
      return
    }

    if (emailCliente) {
      fetch('/api/enviar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pedido-actualizado',
          to: emailCliente,
          data: {
            pedidoId,
            estadoAnterior: estado,
            estadoNuevo: 'cancelado',
            fecha: new Date().toLocaleDateString('es-CL'),
          },
        }),
      }).catch((err) => console.error('Error al enviar email:', err))
    }

    router.refresh()
  }

  if (!confirmando) {
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className={`border-2 border-danger text-danger hover:bg-danger/10 font-bold py-3 px-4 rounded-lg ${TRANSICION_ESTADO} focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 active:scale-[0.97]`}
        >
          Cancelar pedido
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-lg border-2 border-danger bg-danger/5 p-4">
      <p className="text-text font-medium mb-1">¿Cancelar este pedido?</p>
      <p className="text-text-secondary text-sm mb-4">
        Los productos vuelven al catálogo y el pedido queda cancelado. La devolución
        del dinero se gestiona aparte: te contactaremos por correo.
      </p>

      {error && (
        <p className="mb-4 flex items-center gap-1 text-sm font-medium text-danger">
          <IconoError />
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={cancelar}
          disabled={enviando}
          className={`bg-danger text-white font-bold py-3 px-4 rounded-lg ${TRANSICION_ESTADO} disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 active:scale-[0.97]`}
        >
          {enviando ? 'Cancelando…' : 'Sí, cancelar'}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          disabled={enviando}
          className={`border-2 border-ink text-ink hover:bg-surface-alt font-bold py-3 px-4 rounded-lg ${TRANSICION_ESTADO} disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2`}
        >
          Mantener el pedido
        </button>
      </div>
    </div>
  )
}
