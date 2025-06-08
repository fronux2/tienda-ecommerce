import { createClient as createClientServer } from '@/utils/supabase/server';
import { createClient } from '@/utils/supabase/client';
import { type NuevoManga } from '@/types/supabase';

export async function getMangas() {
  const supabase = await createClientServer();
  const { data, error } = await supabase
    .from('mangas')
    .select('*')
    .order('titulo');
  if (error) throw error;
  return data;
}

export async function getMangaPorId(id: string) {
  const supabase = await createClient(); // <-- usa el server client
  const { data, error } = await supabase
    .from('mangas')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

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