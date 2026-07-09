import { type Usuario, Roles } from "@/types/supabase"
import { createClient } from "@/utils/supabase/client"
//update user
export const updateUsuario = async (userId: string, data: Partial<Usuario>): Promise<void> => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('rol_id')
    .eq('id', user.id)
    .single()

  if (!perfil) throw new Error("Perfil no encontrado")

  if (data.rol_id !== undefined && String(data.rol_id) === "3" && perfil.rol_id !== 3) {
    throw new Error("Solo los administradores pueden asignar el rol de administrador")
  }

  if (perfil.rol_id === 2) {
    const { data: target } = await supabase
      .from('usuarios')
      .select('rol_id')
      .eq('id', userId)
      .single()

    if (target && target.rol_id === 3) {
      throw new Error("Los moderadores no pueden modificar el rol de un administrador")
    }
  }

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
    nombre: role.nombre
  }))

  return roles
}