import Link from 'next/link'

export default function ConfirmarPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream p-4">
      <section className="bg-surface rounded-xl border-2 border-ink shadow-2xl w-full max-w-md overflow-hidden">
        <header className="bg-primary py-6 text-center border-b-2 border-ink">
          <h1 className="text-2xl font-bold text-white">Revisa tu correo</h1>
        </header>

        <div className="px-6 py-8 md:px-8 md:py-10">
          <p className="text-text-secondary mb-4">
            Te enviamos un enlace para confirmar tu cuenta. Ábrelo y quedarás dentro
            de MangaNihon.
          </p>
          <p className="text-text-muted text-sm mb-8">
            Si no aparece en unos minutos, revisa la carpeta de spam o correo no
            deseado.
          </p>

          <Link
            href="/login"
            className="block text-center w-full border-2 border-ink text-ink hover:bg-surface-alt font-bold py-3 px-4 rounded-lg shadow transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </section>
    </main>
  )
}
