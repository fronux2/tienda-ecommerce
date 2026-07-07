import { createClient } from '@/utils/supabase/client'
import type { Direccion } from '@/types/supabase'

const supabase = createClient()

export async function getDirecciones(usuarioId: string): Promise<Direccion[]> {
  const { data, error } = await supabase
    .from('direcciones')
    .select('*')
    .eq('usuario_id', usuarioId)

  if (error) {
    console.error('Error fetching direcciones:', error)
    return []
  }

  return data ?? []
}

export async function addDireccion(direccion: Omit<Direccion, 'id'>) {
  const { data, error } = await supabase
    .from('direcciones')
    .insert([direccion])
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateDireccion(id: string, direccion: Partial<Direccion>) {
  const { data, error } = await supabase
    .from('direcciones')
    .update(direccion)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteDireccion(id: string) {
  const { error } = await supabase
    .from('direcciones')
    .delete()
    .eq('id', id)

  if (error) throw error
}
