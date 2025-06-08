
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
  console.log('agregarNuevaCategoria', data);
  const supabase = await createClient();
  // Insertar la nueva categoría en la tabla 'categorias'
  try {
      const insertado = await supabase.from('categorias').insert({
        nombre: data.name,
      })
      console.log('insertado', insertado);
    
  } catch (error) {
    console.error('Error al crear la categoría:', error);
  }
}