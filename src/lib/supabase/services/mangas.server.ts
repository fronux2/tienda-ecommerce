import { UpdateManga } from '@/types/supabase';
import { createClient } from '@/utils/supabase/server';

export async function getMangas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mangas')
    .select('*, categorias(*), series(*)')
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

export async function getTopMangas(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mangas')
    .select('*') // o especifica campos: 'id, title, cover_url'
    .eq('es_popular', true)
    .limit(limit)

  if (error) {
    console.error('Error al obtener mangas:', error.message)
    return []
  }

  return data
}

//getmangaid

export async function getMangaById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mangas')
    .select('*, categorias(*)')
    .eq('id', id);
  if (error) throw error;
  return data;
}

export async function getMangasPopulares() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mangas')
    .select('*, categorias(*), series(*)')
    .eq('es_popular', true)
    .order('titulo');
  if (error) throw error;
  return data;
}