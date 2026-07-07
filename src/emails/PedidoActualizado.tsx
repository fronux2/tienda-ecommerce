interface PedidoActualizadoProps {
  pedidoId: string
  estadoAnterior: string
  estadoNuevo: string
  fecha: string
}

const estadoLabels: Record<string, string> = {
  pendiente: 'Pendiente',
  procesando: 'Procesando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const estadoColors: Record<string, string> = {
  pendiente: '#d97706',
  procesando: '#2563eb',
  enviado: '#4f46e5',
  entregado: '#16a34a',
  cancelado: '#dc2626',
}

const styles = {
  container: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    maxWidth: 600,
    margin: '0 auto',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '24px 32px',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center' as const,
  },
  headerTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
  },
  body: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: '0 0 8px 8px',
    border: '1px solid #e5e7eb',
    borderTop: 'none',
  },
  text: {
    color: '#374151',
    fontSize: 14,
    lineHeight: '1.6',
    margin: '0 0 16px',
  },
  pedidoId: {
    color: '#4f46e5',
    fontWeight: 700,
  },
  estadoBox: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 8,
    textAlign: 'center' as const,
    marginBottom: 16,
  },
  estadoAnterior: {
    color: '#6b7280',
    fontSize: 14,
    textDecoration: 'line-through',
    margin: '0 0 8px',
  },
  estadoNuevo: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
  },
  flecha: {
    color: '#9ca3af',
    fontSize: 18,
    margin: '4px 0',
  },
  label: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  },
  value: {
    color: '#374151',
    fontSize: 14,
    margin: '0 0 16px',
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center' as const,
    color: '#9ca3af',
    fontSize: 12,
  },
}

export default function PedidoActualizado({
  pedidoId,
  estadoAnterior,
  estadoNuevo,
  fecha,
}: PedidoActualizadoProps) {
  const labelAnterior = estadoLabels[estadoAnterior] || estadoAnterior
  const labelNuevo = estadoLabels[estadoNuevo] || estadoNuevo
  const colorNuevo = estadoColors[estadoNuevo] || '#4f46e5'

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Pedido Actualizado</h1>
      </div>

      <div style={styles.body}>
        <p style={styles.text}>
          El estado de tu pedido{' '}
          <span style={styles.pedidoId}>#{pedidoId}</span> ha sido actualizado.
        </p>

        <div style={styles.estadoBox}>
          <p style={styles.estadoAnterior}>{labelAnterior}</p>
          <p style={styles.flecha}>↓</p>
          <p style={{ ...styles.estadoNuevo, color: colorNuevo }}>
            {labelNuevo}
          </p>
        </div>

        <p style={styles.label}>Fecha de actualización</p>
        <p style={styles.value}>{fecha}</p>

        <p style={styles.text}>
          {estadoNuevo === 'enviado'
            ? '¡Tu pedido está en camino! Pronto recibirás más información sobre el seguimiento.'
            : estadoNuevo === 'entregado'
              ? 'Tu pedido ha sido entregado. Esperamos que disfrutes tu compra.'
              : estadoNuevo === 'cancelado'
                ? 'Si tienes dudas sobre la cancelación, contáctanos para más información.'
                : 'Seguiremos actualizándote sobre el progreso de tu pedido.'}
        </p>
      </div>

      <div style={styles.footer}>
        <p>Tienda Mangas — © {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
