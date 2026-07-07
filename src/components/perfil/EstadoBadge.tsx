const colores: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  procesando: 'bg-blue-100 text-blue-800 border-blue-300',
  enviado: 'bg-orange-100 text-orange-800 border-orange-300',
  entregado: 'bg-green-100 text-green-800 border-green-300',
  cancelado: 'bg-red-100 text-red-800 border-red-300',
}

export default function EstadoBadge({ estado }: { estado: string }) {
  const clases = colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300'
  return (
    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${clases}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  )
}
