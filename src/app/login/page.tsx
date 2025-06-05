'use client'

import { useForm } from 'react-hook-form'
import { useTransition } from 'react'
import { login, signup } from './actions'

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [isPending, startTransition] = useTransition()

  const onLogin = (data: FormData) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    startTransition(() => {
      login(formData)
    })
  }

  const onSignup = (data: FormData) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    startTransition(() => {
      signup(formData)
    })
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onLogin)}
        className="flex flex-col gap-4 items-center justify-center border-amber-100 border-2 p-6 rounded"
      >
        <h1 className="text-xl font-bold">Login</h1>

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          className="border-2 border-amber-100 rounded-md"
          {...register('email', { required: 'Email es requerido' })}
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          className="border-2 border-amber-100 rounded-md"
          {...register('password', { required: 'Contraseña requerida' })}
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded active:scale-105"
            disabled={isPending}
          >
            Log in
          </button>
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded active:scale-105"
            onClick={handleSubmit(onSignup)}
            disabled={isPending}
          >
            Sign up
          </button>
        </div>
      </form>
    </main>
  )
}
