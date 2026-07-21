'use client'

import { useRouter } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <main className="h-screen flex items-center justify-center bg-[#FFF8F0] px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-red-600"
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
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Algo salió mal
        </h1>
        <p className="text-gray-600 mb-8">
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors active:scale-95"
        >
          Volver al inicio
        </button>
      </div>
    </main>
  )
}