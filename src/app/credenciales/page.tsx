import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import CampoCopiable from '@/components/CampoCopiable'

export const metadata: Metadata = {
  title: 'Credenciales de prueba',
  robots: { index: false, follow: false },
}

const enProduccion = Boolean(
  process.env.WEBPAY_COMMERCE_CODE && process.env.WEBPAY_API_KEY,
)

export default async function CredencialesPage() {
  // Solo staff: son datos de prueba publicos, pero una pagina llamada
  // "credenciales" a la vista de los clientes solo genera confusion.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('rol_id')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.rol_id === null || perfil.rol_id < 2) redirect('/login')

  return (
    <main className="min-h-screen bg-cream px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Credenciales de prueba</h1>
          <p className="text-text-secondary">
            Tarjetas del ambiente de integración de Transbank para probar el pago con
            Webpay Plus. No son tarjetas reales y no mueven dinero.
          </p>
        </header>

        {enProduccion && (
          <div className="mb-8 rounded-lg border-2 border-warning bg-warning/10 p-4">
            <p className="font-bold text-warning mb-1">Webpay está en producción</p>
            <p className="text-text-secondary text-sm">
              Hay <code className="font-mono">WEBPAY_COMMERCE_CODE</code> y{' '}
              <code className="font-mono">WEBPAY_API_KEY</code> configuradas, así que las
              transacciones son reales y estas tarjetas de prueba no funcionarán.
            </p>
          </div>
        )}

        <section className="mb-6 rounded-xl border-2 border-ink bg-surface overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b-2 border-ink bg-surface-alt px-5 py-4">
            <h2 className="font-bold text-ink">VISA</h2>
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border bg-success/10 text-success border-success/20">
              Aprueba el pago
            </span>
          </header>
          <div className="divide-y divide-border px-5 py-2">
            <CampoCopiable etiqueta="Número de tarjeta" valor="4051 8856 0044 6623" />
            <CampoCopiable etiqueta="CVV" valor="123" />
            <CampoCopiable etiqueta="Vencimiento" valor="Cualquier fecha futura" />
          </div>
        </section>

        <section className="mb-6 rounded-xl border-2 border-ink bg-surface overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b-2 border-ink bg-surface-alt px-5 py-4">
            <h2 className="font-bold text-ink">Mastercard</h2>
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border bg-danger/10 text-danger border-danger/20">
              Rechaza el pago
            </span>
          </header>
          <div className="divide-y divide-border px-5 py-2">
            <CampoCopiable etiqueta="Número de tarjeta" valor="5186 0595 5959 0568" />
            <CampoCopiable etiqueta="CVV" valor="123" />
            <CampoCopiable etiqueta="Vencimiento" valor="Cualquier fecha futura" />
          </div>
          <p className="border-t border-border px-5 py-3 text-sm text-text-secondary">
            Úsala para probar qué ve el cliente cuando el pago falla, no solo el camino feliz.
          </p>
        </section>

        <section className="mb-8 rounded-xl border-2 border-ink bg-surface overflow-hidden">
          <header className="border-b-2 border-ink bg-surface-alt px-5 py-4">
            <h2 className="font-bold text-ink">Autenticación del banco</h2>
          </header>
          <div className="divide-y divide-border px-5 py-2">
            <CampoCopiable etiqueta="RUT" valor="11.111.111-1" />
            <CampoCopiable etiqueta="Clave" valor="123" />
          </div>
          <p className="border-t border-border px-5 py-3 text-sm text-text-secondary">
            Después de ingresar la tarjeta, Webpay simula el paso por el banco y pide
            estos datos.
          </p>
        </section>

        <div className="rounded-lg border border-border bg-surface-alt p-4 text-sm text-text-secondary">
          <p className="mb-2">
            La lista completa y actualizada de tarjetas de prueba está en la{' '}
            <a
              href="https://www.transbank.cl/desarrolladores/documentacion"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary-hover underline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
            >
              documentación de Transbank
            </a>
            , sección de tarjetas de prueba.
          </p>
          <Link
            href="/"
            className="text-primary hover:text-primary-hover rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  )
}
