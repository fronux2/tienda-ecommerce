const pasos = ['pendiente', 'procesando', 'enviado', 'entregado']

export default function TimelineEstado({ estadoActual }: { estadoActual: string }) {
  const indiceActual = pasos.indexOf(estadoActual)
  if (indiceActual === -1) return null

  const esCancelado = estadoActual === 'cancelado'

  return (
    <div className="flex items-center gap-1 my-4">
      {pasos.map((paso, i) => {
        const completado = !esCancelado && i <= indiceActual
        const activo = !esCancelado && i === indiceActual
        return (
          <div key={paso} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  esCancelado
                    ? 'border-red-400 bg-red-100 text-red-600'
                    : completado
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {esCancelado ? '✕' : completado ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  activo ? 'text-green-600' : esCancelado ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {paso.charAt(0).toUpperCase() + paso.slice(1)}
              </span>
            </div>
            {i < pasos.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  esCancelado
                    ? 'bg-red-300'
                    : completado && i < indiceActual
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
