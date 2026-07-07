interface Item {
  nombre: string
  cantidad: number
  precio: number
}

interface PedidoConfirmadoProps {
  pedidoId: string
  items: Item[]
  total: number
  direccion: string
  fecha: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price)
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
    backgroundColor: '#1d4ed8',
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
    color: '#1d4ed8',
    fontWeight: 700,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: 16,
  },
  th: {
    textAlign: 'left' as const,
    padding: '8px 12px',
    borderBottom: '2px solid #e5e7eb',
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  td: {
    padding: '8px 12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
    fontSize: 14,
  },
  totalRow: {
    fontWeight: 700,
    fontSize: 16,
    color: '#111827',
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

export default function PedidoConfirmado({
  pedidoId,
  items,
  total,
  direccion,
  fecha,
}: PedidoConfirmadoProps) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>¡Pedido Confirmado!</h1>
      </div>

      <div style={styles.body}>
        <p style={styles.text}>
          Gracias por tu compra. Tu pedido{' '}
          <span style={styles.pedidoId}>#{pedidoId}</span> ha sido recibido y
          estamos procesándolo.
        </p>

        <p style={styles.label}>Resumen del pedido</p>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Producto</th>
              <th style={styles.th}>Cant.</th>
              <th style={styles.th} align="right">Precio</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td style={styles.td}>{item.nombre}</td>
                <td style={styles.td}>{item.cantidad}</td>
                <td style={styles.td} align="right">
                  {formatPrice(item.cantidad * item.precio)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ ...styles.text, textAlign: 'right' as const }}>
          <span style={styles.totalRow}>Total: {formatPrice(total)}</span>
        </p>

        <p style={styles.label}>Dirección de envío</p>
        <p style={styles.value}>{direccion}</p>

        <p style={styles.label}>Fecha del pedido</p>
        <p style={styles.value}>{fecha}</p>
      </div>

      <div style={styles.footer}>
        <p>Tienda Mangas — © {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
