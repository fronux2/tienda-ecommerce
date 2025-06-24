import { createClient } from '@/utils/supabase/client';


export async function getRoles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('id');
  if (error) throw error;
  return data;
}