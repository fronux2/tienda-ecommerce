import Badge, { BadgeVariant } from '@/components/Badge'

const variantes: Record<string, BadgeVariant> = {
  pendiente: 'warning',
  procesando: 'info',
  enviado: 'info',
  entregado: 'success',
  cancelado: 'danger',
}

export default function EstadoBadge({ estado }: { estado: string }) {
  const variante = variantes[estado] ?? 'neutral'
  return (
    <Badge variant={variante}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </Badge>
  )
}
