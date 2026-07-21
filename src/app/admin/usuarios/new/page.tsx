"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { nuevoUsuarioSchema, NuevoUsuarioSchema } from "@/schemas/usuarioSchema";
import { type NuevoUsuario } from '@/types/supabase';
import { useState, useEffect } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkRole = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: perfil } = await supabase
        .from('usuarios')
        .select('rol_id')
        .eq('id', user.id)
        .single()

      if (!perfil || perfil.rol_id! < 2) {
        router.push('/login')
      } else {
        setChecking(false)
      }
    }
    checkRole()
  }, [router])

  const { register, reset, handleSubmit, formState: { errors } } = useForm<NuevoUsuarioSchema>({
    resolver: zodResolver(nuevoUsuarioSchema),
  });
  const [loading, setLoading] = useState(false)

  if (checking) return null

  const onSubmit = async (data: NuevoUsuario) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/crear-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      await res.json();
      reset();
    } finally {
      setLoading(false)
    }
  }

  return(<>
  <main className="flex flex-col items-center justify-center min-h-screen py-2">
    <h1 className="text-3xl font-bold mb-8">Crear un Nuevo Usuario</h1>
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className=" shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
    >
      <div>
        <label htmlFor="email" className="block font-semibold mb-1">Email:</label>
        <input 
          type="text" 
          id="email" 
          {...register('email')} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.email && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="password" className="block font-semibold mb-1">Contraseña:</label>
        <input 
          type="password" 
          id="password" 
          {...register('password')} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
         

      <LoadingButton 
        type="submit" 
        loading={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Crear
      </LoadingButton>
    </form>
  </main>
  
  </>)}