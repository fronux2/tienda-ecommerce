import { createClient } from '@/utils/supabase/client';
import { CartItem } from "@/store/cartStore";

const supabase = createClient()

// Obtener carrito del usuario
export const fetchCartFromSupabase = async (user_id: string) => {
  const { data, error } = await supabase
    .from("carrito")
    .select("*, mangas(*)")
    .eq("usuario_id", user_id);

  if (error) throw error;

  return data as CartItem[];
};

// Agregar al carrito
export const addToCartSupabase = async (item: CartItem) => {
  const { data, error } = await supabase
    .from("carrito")
    .upsert({
      user_id: item.user_id,
      manga_id: item.manga_id,
      cantidad: item.cantidad
    }, { onConflict: 'user_id,manga_id' });

  if (error) throw error;
  return data;
};

// Eliminar del carrito
export const removeFromCartSupabase = async (user_id: string, manga_id: string) => {
  const { error } = await supabase
    .from("carrito")
    .delete()
    .match({ user_id, manga_id });

  if (error) throw error;
};

// Actualizar cantidad
export const updateCartQuantitySupabase = async (user_id: string, manga_id: string, cantidad: number) => {
  const { error } = await supabase
    .from("carrito")
    .update({ cantidad })
    .match({ user_id, manga_id });

  if (error) throw error;
};

// Limpiar carrito
export const clearCartSupabase = async (user_id: string) => {
  const { error } = await supabase
    .from("carrito")
    .delete()
    .eq("usuario_id", user_id);

  if (error) throw error;
};
