import { create } from 'zustand'
import { addToCartSupabase, clearCartSupabase, removeFromCartSupabase, updateCartQuantitySupabase } from '@/lib/supabase/services/carrito.cliente'
export type CartItem = { 
  id?: string
  usuario_id: string | null
  manga_id: string
  mangas?: {
    id: string
    titulo: string
    precio: number
    imagen_portada: string
    stock: number
  }
  cantidad: number
}

export type CartState = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (manga_id: string, usuario_id: string) => void
  clearCart: (usuario_id: string) => void
  updateQuantity: (usuario_id: string, manga_id: string, cantidad: number) => void
  setCart: (items: CartItem[]) => void
}

export const useCartStore = create<CartState>((set,get) => ({
  cart: [],

  addToCart: async (item) => {
    const state = get()
    const existingItem = state.cart.find(i => i.manga_id === item.manga_id && i.usuario_id === item.usuario_id)
    console.log('itemmmmmmmm', item)
    if (existingItem) {
      console.log('holaaaa1')
      const nuevaCantidad = existingItem.cantidad + item.cantidad
      await updateCartQuantitySupabase(item.usuario_id, item.manga_id, nuevaCantidad)
      set({
        cart: state.cart.map(i =>
          i.manga_id === item.manga_id
            ? { ...i, cantidad: nuevaCantidad }
            : i
        )
      })
    } else {
      console.log(item)
      await addToCartSupabase(item)
      set({ cart: [...state.cart, item] })
    }
  },

  removeFromCart: async(manga_id, usuario_id) =>{
    console.log('removeFromCart', manga_id, usuario_id)
    if(usuario_id) await removeFromCartSupabase(manga_id, usuario_id)
    set((state) => ({
      cart: state.cart.filter((item) => item.manga_id !== manga_id),
    }))
  },

  clearCart: async (usuario_id) => {
    await clearCartSupabase(usuario_id)
    set({ cart: [] })},

  updateQuantity: async (usuario_id, manga_id, cantidad) =>{
    await updateCartQuantitySupabase(usuario_id, manga_id, cantidad)
    set((state) => ({
      cart: state.cart.map((item) =>
        item.manga_id === manga_id ? { ...item, cantidad } : item
      ),
    }))
  },

  setCart: (items) => set({ cart: items }),
}))
