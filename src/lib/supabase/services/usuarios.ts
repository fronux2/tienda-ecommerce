import { createClient } from '@/utils/supabase/server'
import type { Usuario } from '@/types/supabase'

// Obtener el rol del usuario
export const getRolUsuario = async (userId: string): Promise<number | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('usuarios')
    .select('rol_id')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error al obtener el rol del usuario:', error.message)
    return null
  }

  return data?.rol_id ?? null
}

// Obtener el perfil del usuario
export const getPerfilUsuario = async (userId: string): Promise<Usuario | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) {
    console.error('Error al obtener el perfil:', error?.message)
    return null
  }

  const usuario: Usuario = {
    id: data.id,
    email: data.email,
    rol_id: data.rol_id,
    // Agrega aquí más campos si tu tabla tiene otros
  }

  return usuario
}
