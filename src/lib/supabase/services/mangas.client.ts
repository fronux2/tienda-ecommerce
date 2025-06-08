import { createClient } from '@/utils/supabase/client';
import { type NuevoManga, type UpdateManga } from '@/types/supabase';

export async function crearManga(manga: NuevoManga) {
  console.log('Creando manga:', manga);
  const supabase = await createClient(); // <-- usa el server client
  const { data, error } = await supabase
    .from('mangas')
    .insert(manga)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateManga(id: string, mangaData:UpdateManga) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mangas')
    .update(mangaData)
    .eq('id', id);
  if (error) throw error;
  return data;
}