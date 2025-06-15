"use client";

import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export default async function getPedidos() {    
  const { data, error } = await supabase.from("pedidos").select("*");

  if (error) {
    console.error("Error fetching pedidos:", error);
    return [];
  }

  return data;
}

//update

export async function updatePedido(id: string, pedidoData: UpdatePedido) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pedidos")
    .update(pedidoData)
    .eq("id", id);
  if (error) throw error;
  return data;
}