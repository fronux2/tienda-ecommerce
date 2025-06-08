'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginAction } from './actions'
import { type LoginSchema, loginSchema } from '@/schemas/loginSchema'

export default function LoginPage() {

  const {
    register,
    formState: { errors },
  } = useForm<LoginSchema>({resolver: zodResolver(loginSchema)})

  return (
    <main className="h-screen flex items-center justify-center">
      <form
        action={loginAction}
        className="flex flex-col gap-4 items-center justify-center border-amber-100 border-2 p-6 rounded-lg shadow-md"
      >
        <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>

        <div className="flex flex-col w-full max-w-xs">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: true })}
            name="email"
            className="border border-amber-100 rounded-md p-2"
          />
          {errors.email && <span className="text-red-500 text-sm">Email requerido</span>}
        </div>

        <div className="flex flex-col w-full max-w-xs">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: true })}
            name="password"
            className="border border-amber-100 rounded-md p-2"
          />
          {errors.password && <span className="text-red-500 text-sm">Contraseña requerida</span>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </form>
    </main>
  )
}
