import { UpdateManga } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';

export async function getMangas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mangas')
    .select('*')
    .order('titulo');
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

