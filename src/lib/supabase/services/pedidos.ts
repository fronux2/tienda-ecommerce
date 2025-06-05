import { createClient } from '@/utils/supabase/server';

export async function getPedidosPorUsuario(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, detalles_pedidos(*, mangas(title, image_url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}