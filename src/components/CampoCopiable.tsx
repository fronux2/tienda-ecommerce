'use client'

import { useState } from 'react'
import { IconoCumple } from '@/components/icons/estado'
import { TRANSICION_ESTADO } from '@/lib/ui/transiciones'

/**
 * Valor con boton de copiar. Al probar pagos estos numeros se copian una y otra
 * vez, asi que el copiado es la accion principal de la fila, no un adorno.
 */
export default function CampoCopiable({
  etiqueta,
  valor,
}: {
  etiqueta: string
  valor: string
}) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor.replace(/\s/g, ''))
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      // Sin permiso de portapapeles: el valor se puede seleccionar a mano.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-text-muted text-xs uppercase tracking-wide">{etiqueta}</p>
        <p className="text-text font-mono text-base tabular-nums truncate">{valor}</p>
      </div>

      <button
        type="button"
        onClick={copiar}
        aria-label={`Copiar ${etiqueta}`}
        className={`shrink-0 inline-flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-medium ${TRANSICION_ESTADO} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 active:scale-[0.97] ${
          copiado
            ? 'border-success text-success bg-success/10'
            : 'border-border text-text-secondary hover:bg-surface-alt'
        }`}
      >
        {copiado && <IconoCumple />}
        {copiado ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}
