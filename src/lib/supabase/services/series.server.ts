import { createClient } from '@/utils/supabase/server';

export async function getSeries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .order('nombre');
  if (error) throw error;
  return data;
}