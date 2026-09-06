'use client'

import { IconoCumple, IconoError, IconoPendiente } from './icons/estado'
import { TRANSICION_ESTADO } from '@/lib/ui/transiciones'

/**
 * Estado de coincidencia entre la contraseña y su confirmación.
 *
 * Mientras lo escrito sea el comienzo de la contraseña de arriba, todavía
 * puede terminar coincidiendo: ahí el estado es neutro, no rojo. El rojo
 * aparece solo cuando ya divergieron y no hay forma de que coincidan.
 */
export default function PasswordCoincidencia({
  password,
  confirmacion,
}: {
  password: string
  confirmacion: string
}) {
  if (!confirmacion) return null

  const coinciden = password.length > 0 && confirmacion === password
  const aunPuedeCoincidir = password.startsWith(confirmacion)

  const { Icono, mensaje, color } = coinciden
    ? { Icono: IconoCumple, mensaje: 'Las contraseñas coinciden', color: 'text-success' }
    : aunPuedeCoincidir
      ? { Icono: IconoPendiente, mensaje: 'Sigue escribiendo', color: 'text-text-muted' }
      : { Icono: IconoError, mensaje: 'Las contraseñas no coinciden', color: 'text-danger' }

  return (
    <p
      role="status"
      aria-live="polite"
      className={`mt-2 flex items-center gap-1 text-sm font-medium ${TRANSICION_ESTADO} ${color}`}
    >
      <Icono />
      {mensaje}
    </p>
  )
}
