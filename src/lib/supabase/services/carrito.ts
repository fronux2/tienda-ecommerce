import { createClient } from '@/utils/supabase/server';

export async function getCarritoPorUsuario(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('carrito_compras')
    .select('*, mangas(title, price, image_url)')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}