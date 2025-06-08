'use server'
import  agregarNuevaCategoria  from '@/lib/supabase/services/categorias.client'
import { revalidatePath } from 'next/cache'

export async function crearCategoria(data: { name: string }) {
  await agregarNuevaCategoria(data)

  revalidatePath('/admin/crear') // Opcional: actualiza la página
}
