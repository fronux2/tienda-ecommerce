import { createClient } from '@/utils/supabase/server';

export async function getPedidosPorUsuario(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, detalle_pedidos(*, mangas(*))')
    .eq('usuario_id', userId)
    .order('fecha_pedido', { ascending: false });
  if (error) throw error;
  return data;
}