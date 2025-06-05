import { createClient } from '@/utils/supabase/server';

export async function getMangas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mangas')
    .select('*')
    .order('title');
  if (error) throw error;
  return data;
}

export async function getMangaPorId(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mangas')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}