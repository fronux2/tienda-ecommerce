'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginAction } from './actions'
import { type LoginSchema, loginSchema } from '@/schemas/loginSchema'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import LoadingButton from '@/components/LoadingButton'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setLoginError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await loginAction(formData)
      if (result?.error) {
        setLoginError(result.error)
      }
    } catch {
      // redirect() from server actions throws NEXT_REDIRECT; caught here
    }
    setLoading(false)
  }

  const {
    register,
    formState: { errors },
  } = useForm<LoginSchema>({resolver: zodResolver(loginSchema)})

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream p-4">
      <section className="bg-surface rounded-xl border-2 border-ink shadow-2xl w-full max-w-md overflow-hidden">
        {/* Encabezado con fondo rojo */}
        <header className="bg-primary py-6 text-center border-b-2 border-ink">
          <h1 className="text-2xl font-bold text-white">Iniciar sesión en MangaNihon</h1>
        </header>

        {loginError && (
          <div className="mx-6 mt-6 flex items-start gap-3 p-4 bg-red-50 border-l-4 border-danger rounded-r-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-danger font-medium">{loginError}</p>
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          className="px-6 py-8 md:px-8 md:py-10"
        >
          {/* Campo Email */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-ink font-medium mb-2"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register('email', { required: true })}
                name="email"
                className="w-full p-3 pl-10 bg-cream border-2 border-border text-ink rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-text-muted"
                placeholder="tucorreo@ejemplo.com"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
            </div>
            {errors.email && (
              <p className="mt-2 text-danger text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Email requerido
              </p>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-ink font-medium mb-2"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                {...register('password', { required: true })}
                name="password"
                className="w-full p-3 pl-10 bg-cream border-2 border-border text-ink rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-text-muted"
                placeholder="••••••••"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            {errors.password && (
              <p className="mt-2 text-danger text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Contraseña requerida
              </p>
            )}
          </div>

          {/* Recordar contraseña y olvidé contraseña */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary-light border-border rounded bg-cream"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-text-secondary">
                Recordar sesión
              </label>
            </div>
            <a href="#" className="text-sm text-primary hover:text-primary-hover">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de inicio de sesión */}
          <LoadingButton
            type="submit"
            loading={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
          >
            Iniciar sesión
          </LoadingButton>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">¿No tienes cuenta?</span>
            </div>
          </div>

          {/* Registrarse */}
          <Link
            href="/registro"
            className="block text-center w-full border-2 border-ink text-ink hover:bg-surface-alt font-bold py-3 px-4 rounded-lg shadow transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
          >
            Crear cuenta nueva
          </Link>
        </form>
      </section>
    </main>
  )
}
