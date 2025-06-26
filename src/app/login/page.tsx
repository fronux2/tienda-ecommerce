'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginAction } from './actions'
import { type LoginSchema, loginSchema } from '@/schemas/loginSchema'
import Link from 'next/link'

export default function LoginPage() {

  const {
    register,
    formState: { errors },
  } = useForm<LoginSchema>({resolver: zodResolver(loginSchema)})

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-4">
      <section className="bg-white rounded-xl border-2 border-black shadow-2xl w-full max-w-md overflow-hidden">
        {/* Encabezado con fondo rojo */}
        <header className="bg-red-600 py-6 text-center border-b-2 border-black">
          <h1 className="text-2xl font-bold text-white">Iniciar sesión en MangaNihon</h1>
        </header>

        <form 
          action={loginAction}
          className="px-6 py-8 md:px-8 md:py-10"
        >
          {/* Campo Email */}
          <div className="mb-6">
            <label 
              htmlFor="email" 
              className="block text-black font-medium mb-2"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register('email', { required: true })}
                name="email"
                className="w-full p-3 pl-10 bg-[#FFF8F0] border-2 border-gray-300 text-black rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                placeholder="tucorreo@ejemplo.com"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
            </div>
            {errors.email && (
              <p className="mt-2 text-red-600 text-sm flex items-center">
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
              className="block text-black font-medium mb-2"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                {...register('password', { required: true })}
                name="password"
                className="w-full p-3 pl-10 bg-[#FFF8F0] border-2 border-gray-300 text-black rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                placeholder="••••••••"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            {errors.password && (
              <p className="mt-2 text-red-600 text-sm flex items-center">
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
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded bg-[#FFF8F0]"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Recordar sesión
              </label>
            </div>
            <a href="#" className="text-sm text-red-600 hover:text-red-800">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Iniciar sesión
          </button>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
            </div>
          </div>

          {/* Registrarse */}
          <Link 
            href="/registro" 
            className="block text-center w-full border-2 border-black text-black hover:bg-gray-100 font-bold py-3 px-4 rounded-lg shadow transition-colors duration-300"
          >
            Crear cuenta nueva
          </Link>
        </form>
      </section>
    </main>
  )
}
