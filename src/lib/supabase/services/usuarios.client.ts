import { type Usuario, Roles } from "@/types/supabase"
import { createClient } from "@/utils/supabase/client"
//update user
export const updateUsuario = async (userId: string, data: Partial<Usuario>): Promise<void> => {
  const supabase = await createClient()
  console.log('Datos a actualizar:', data)
  console.log('ID del usuario:', userId)
  const { error } = await supabase
    .from('usuarios')
    .update(data)
    .eq('id', userId)

  if (error) {
    console.error('Error al actualizar el usuario:', error.message)
  }
}

// get user
export const getUsuarios = async (): Promise<Usuario[]> => {
  const supabase = await createClient()

  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('id, email,rol_id, roles:rol_id(id,nombre)')
    .order('email')
  if (error) {
    console.error('Error al obtener los usuarios:', error.message)
    return []
  }
  
  return usuarios
}

// get roles
export const getRoles = async (): Promise<Roles[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('roles')
    .select('id, nombre')

  if (error) {
    console.error('Error al obtener los roles:', error.message)
    return []
  }

  const roles = data.map((role: Roles) => ({
    id: role.id,
    nombre: role.nombre,
  }))

  return roles
}