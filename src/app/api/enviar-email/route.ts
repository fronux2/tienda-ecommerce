import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendEmail } from '@/lib/email'
import PedidoConfirmado from '@/emails/PedidoConfirmado'
import PedidoActualizado from '@/emails/PedidoActualizado'
import PedidoRecibidoAdmin from '@/emails/PedidoRecibidoAdmin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { type, to, data } = body

    if (!data) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    switch (type) {
      case 'pedido-confirmado': {
        const { pedidoId, items, total, direccion, fecha } = data

        if (!pedidoId || !items || total === undefined || !direccion || !fecha) {
          return NextResponse.json({ error: 'Datos incompletos para pedido-confirmado' }, { status: 400 })
        }

        await sendEmail({
          to,
          subject: `¡Pedido #${pedidoId} Confirmado! - Tienda Mangas`,
          react: PedidoConfirmado({ pedidoId, items, total, direccion, fecha }),
        })

        return NextResponse.json({ success: true })
      }

      case 'pedido-actualizado': {
        const { pedidoId, estadoAnterior, estadoNuevo, fecha } = data

        if (!pedidoId || !estadoAnterior || !estadoNuevo || !fecha) {
          return NextResponse.json({ error: 'Datos incompletos para pedido-actualizado' }, { status: 400 })
        }

        const estadoLabels: Record<string, string> = {
          pendiente: 'Pendiente',
          procesando: 'Procesando',
          enviado: 'Enviado',
          entregado: 'Entregado',
          cancelado: 'Cancelado',
        }

        await sendEmail({
          to,
          subject: `Tu pedido #${pedidoId} ahora está ${(estadoLabels[estadoNuevo] || estadoNuevo).toLowerCase()} - Tienda Mangas`,
          react: PedidoActualizado({ pedidoId, estadoAnterior, estadoNuevo, fecha }),
        })

        return NextResponse.json({ success: true })
      }

      case 'pedido-recibido-admin': {
        const { pedidoId, clienteEmail, items, total, direccion, fecha } = data

        if (!pedidoId || !clienteEmail || !items || total === undefined || !direccion || !fecha) {
          return NextResponse.json({ error: 'Datos incompletos para pedido-recibido-admin' }, { status: 400 })
        }

        const adminEmails = process.env.NOTIFICATION_EMAILS
        if (!adminEmails) {
          return NextResponse.json({ error: 'NOTIFICATION_EMAILS no configurado' }, { status: 500 })
        }

        const emails = adminEmails.split(',').map(e => e.trim()).filter(Boolean)
        const results = await Promise.allSettled(
          emails.map(email =>
            sendEmail({
              to: email,
              subject: `📦 Nuevo Pedido #${pedidoId} - Tienda Mangas`,
              react: PedidoRecibidoAdmin({ pedidoId, clienteEmail, items, total, direccion, fecha }),
            })
          )
        )

        return NextResponse.json({ success: true, sent: results.length })
      }

      default:
        return NextResponse.json({ error: 'Tipo de email no válido' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error al enviar email:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
