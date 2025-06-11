// app/api/crear-usuario/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCarritoPorUsuario } from '@/lib/supabase/services/carrito';

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json();
  const { mangaId, userId } = body;
  const cartItems = await getCarritoPorUsuario(userId)
  console.log('cartItems222', cartItems)
  const { data: manga } = await supabase
      .from('mangas')
      .select('stock')
      .eq('id', mangaId)
      .single()
  console.log('manga2222', manga)

    if (!manga || manga.stock < 1) {
      return NextResponse.json({ error: 'Producto sin stock' }, { status: 400 });
    }

  const existingItem = cartItems.find(item => item.manga_id === mangaId)
    console.log('existingItem', existingItem)
  if (existingItem) {
    const { data, error } = await supabase
      .from('carrito')
      .update({ cantidad: existingItem.cantidad + 1 })
      .eq('id', existingItem.id)
      .select() // Ensure data is returned and typed
      if (error) {
        console.log('error', error)
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    console.log('data222', data)
    if (data && data.length > 0) return NextResponse.json({ user: data[0].usuario_id }, { status: 200 });  
  }    
   else {
    const { data, error } = await supabase
      .from('carrito')
      .insert({
        usuario_id: userId,
        manga_id: mangaId,
      })
      .select(); // Ensure data is returned and typed

    if (error) {
      console.log('error', error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ user: data && data.length > 0 ? data[0].usuario_id : null }, { status: 200 });  
  } 
  

  
}