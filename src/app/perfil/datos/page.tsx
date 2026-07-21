'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import LoadingButton from '@/components/LoadingButton'

export default function MisDatos() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [cambiandoPass, setCambiandoPass] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setEmail(user.email ?? '')
      setLoading(false)
    }
    fetchUser()
  }, [supabase, router])

  const handleChangePassword = async () => {
    setCambiandoPass(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/perfil/datos`,
      })
      if (error) throw error
      alert('Te hemos enviado un correo para restablecer tu contraseña')
    } catch {
      alert('Error al enviar el correo de restablecimiento')
    } finally {
      setCambiandoPass(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Mis Datos</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">El email no se puede cambiar desde aquí</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="font-semibold mb-2">Contraseña</h2>
          <p className="text-sm text-gray-600 mb-4">
            Recibirás un correo con instrucciones para restablecer tu contraseña
          </p>
          <LoadingButton
            onClick={handleChangePassword}
            loading={cambiandoPass}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Cambiar contraseña
          </LoadingButton>
        </div>

        <div className="border-t pt-6">
          <h2 className="font-semibold mb-2">Cerrar sesión</h2>
          <p className="text-sm text-gray-600 mb-4">
            Cierra tu sesión en este dispositivo
          </p>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors active:scale-95"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
