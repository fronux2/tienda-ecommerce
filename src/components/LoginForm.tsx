'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type LoginFormInputs = {
  email: string
  password: string
}

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true)
    setErrorMsg('')
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setErrorMsg(error.message)
    } else {
      // Redirigir o hacer algo al loguearse exitosamente
      window.location.href = '/'
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email es obligatorio' })}
          className="border p-2 w-full"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label>Contraseña</label>
        <input
          type="password"
          {...register('password', { required: 'Contraseña es obligatoria' })}
          className="border p-2 w-full"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
