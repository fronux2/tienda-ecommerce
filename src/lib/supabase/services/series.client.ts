
import { NuevaSerie } from '@/types/supabase';
import { createClient } from '@/utils/supabase/client';

export async function getSeriesClient() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .order('nombre');
  if (error) throw error;
  return data;
}

export default async function agregarNuevaSerie(data: NuevaSerie) {
  console.log('agregarNuevaSerie', data);
  const supabase = await createClient();
  // Insertar la nueva serie en la tabla 'series'
  try {
      const insertado = await supabase.from('series').insert(data)
      console.log('insertado', insertado);
    
  } catch (error) {
    console.error('Error al crear la serie:', error);
  }
}