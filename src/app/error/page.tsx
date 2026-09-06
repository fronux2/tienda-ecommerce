import Link from 'next/link'

const MOTIVOS: Record<string, { titulo: string; mensaje: string; volverA: string; volverTexto: string }> = {
  'password-filtrada': {
    titulo: 'Esa contraseña no es segura',
    mensaje:
      'La contraseña que elegiste aparece en filtraciones públicas de datos, así que cualquiera podría usarla para entrar a tu cuenta. Elige una distinta, idealmente generada por un gestor de contraseñas.',
    volverA: '/registro',
    volverTexto: 'Volver al registro',
  },
}

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>
}) {
  const { motivo } = await searchParams
  const detalle = motivo ? MOTIVOS[motivo] : undefined

  const titulo = detalle?.titulo ?? 'Algo salió mal'
  const mensaje = detalle?.mensaje ?? 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
  const volverA = detalle?.volverA ?? '/'
  const volverTexto = detalle?.volverTexto ?? 'Volver al inicio'

  return (
    <main className="h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-danger"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text mb-3">
          {titulo}
        </h1>
        <p className="text-text-secondary mb-8">
          {mensaje}
        </p>
        <Link
          href={volverA}
          className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition-colors active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
        >
          {volverTexto}
        </Link>
      </div>
    </main>
  )
}
