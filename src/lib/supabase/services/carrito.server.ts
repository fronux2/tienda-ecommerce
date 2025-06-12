import { createClient } from '@/utils/supabase/server';
import { CartItem } from "@/store/cartStore";


// Obtener carrito del usuario
export const fetchCartFromSupabase = async (user_id: string) => {
    const supabase = await createClient()
  const { data, error } = await supabase
    .from("carrito")
    .select("*, mangas(*)")
    .eq("usuario_id", user_id);

  if (error) throw error;

  return data as CartItem[];
};