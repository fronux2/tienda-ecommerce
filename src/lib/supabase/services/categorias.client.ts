
import { createClient } from '@/utils/supabase/client';

export async function getCategoriasClient() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');
  if (error) throw error;
  return data;
}

export default async function agregarNuevaCategoria(data: { name: string }) {
  const supabase = await createClient();
  // Insertar la nueva categoría en la tabla 'categorias'
  try {
      await supabase.from('categorias').insert({
        nombre: data.name,
      })
    
  } catch (error) {
    console.error('Error al crear la categoría:', error);
  }
}


export async function updateCategoria(id: string, updates: Partial<{ nombre: string }>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categorias')
    .update(updates)
    .eq('id', id)
    .select('*');
  if (error) throw error;
  return data;
}