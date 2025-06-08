import { createClient } from '@/utils/supabase/server';

export async function getCategorias() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');
  if (error) throw error;
  return data;
}
