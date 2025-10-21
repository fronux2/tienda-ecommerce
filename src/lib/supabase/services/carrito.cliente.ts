import { createClient } from '@/utils/supabase/client';
import { CartItem } from "@/store/cartStore";

const supabase = createClient()

// Obtener carrito del usuario
export const fetchCartFromSupabase = async (usuario_id: string) => {
  const { data, error } = await supabase
    .from("carrito")
    .select("*, mangas(*)")
    .eq("usuario_id", usuario_id);

  if (error) throw error;

  return data as CartItem[];
};

// Agregar al carrito
export const addToCartSupabase = async (item: CartItem) => {
  const { error } = await supabase
    .from("carrito")
    .insert({
      usuario_id: item.usuario_id,
      manga_id: item.manga_id,
      cantidad: item.cantidad
    });
  if (error) throw error;
};

// Eliminar del carrito
export const removeFromCartSupabase = async (manga_id: string ,usuario_id: string) => { 
  const { error } = await supabase
    .from("carrito")
    .delete()
    .eq("usuario_id", usuario_id)
    .eq("manga_id", manga_id);
  if (error) throw error;
};

// Actualizar cantidad
export const updateCartQuantitySupabase = async (usuario_id: string, manga_id: string, cantidad: number) => {
  const { error } = await supabase
    .from("carrito")
    .update({ cantidad })
    .eq("usuario_id", usuario_id)
    .eq("manga_id", manga_id);

  if (error) throw error;
};

// Limpiar carrito
export const clearCartSupabase = async (usuario_id: string) => {
  const { error } = await supabase
    .from("carrito")
    .delete()
    .eq("usuario_id", usuario_id);

  if (error) throw error;
};
