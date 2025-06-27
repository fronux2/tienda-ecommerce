import { createClient } from '@/utils/supabase/client';

export const addToCartSupabase = async (item: any) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('carrito')
    .insert({
      usuario_id: item.usuario_id,
      manga_id: item.manga_id,
      cantidad: item.cantidad
    });
  
  if (error) throw error;
};

export const removeFromCartSupabase = async (manga_id: string, usuario_id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('carrito')
    .delete()
    .eq('manga_id', manga_id)
    .eq('usuario_id', usuario_id);
  
  if (error) throw error;
};

export const clearCartSupabase = async (usuario_id: string) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('carrito')
    .delete()
    .eq('usuario_id', usuario_id);
  
  if (error) throw error;
};

export const updateCartQuantitySupabase = async (usuario_id: string, manga_id: string, cantidad: number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from('carrito')
    .update({ cantidad })
    .eq('manga_id', manga_id)
    .eq('usuario_id', usuario_id);
  
  if (error) throw error;
};