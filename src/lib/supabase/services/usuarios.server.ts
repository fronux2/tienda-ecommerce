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


// Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email, roles:rol_id(id,nombre)')
    .order('email')

  if (error) {
    console.error('Error al obtener los usuarios:', error.message)
    return []
  }

  const usuarios = data.map((usuario: Usuario) => ({
    id: usuario.id,
    email: usuario.email,
    roles: usuario.roles,
  }))

  return usuarios
}

//getUserForId
export const getUserForId = async (userId: string): Promise<Usuario | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email, roles:rol_id(id,nombre)')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error al obtener el usuario:', error.message)
    return null
  }

  return data ?? null
}

