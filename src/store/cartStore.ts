import { create } from 'zustand'
import { addToCartSupabase, clearCartSupabase, removeFromCartSupabase, updateCartQuantitySupabase } from '@/lib/supabase/services/carrito.client'
import { saveCartToLocalStorage, clearCartFromLocalStorage } from '@/lib/cartLocalStorage'
export type CartItem = { 
  id?: string
  usuario_id: string | null
  manga_id: string
  mangas?: {
    id?: string
    titulo: string
    precio: number
    imagen_portada: string
    stock: number
  }
  cantidad: number
}

export type CartState = {
  cart: CartItem[]
  totalItems: number
  addToCart: (item: CartItem) => void
  removeFromCart: (manga_id: string, usuario_id: string | null) => void
  clearCart: (usuario_id: string | null) => void
  updateQuantity: (usuario_id: string | null, manga_id: string, cantidad: number) => void
  setCart: (items: CartItem[]) => void
}

const sumarItems = (items: CartItem[]) => items.reduce((acc, i) => acc + i.cantidad, 0)

export const useCartStore = create<CartState>((set,get) => ({
  cart: [],
  totalItems: 0,

  addToCart: async (item) => {
    const state = get()
    const existingItem = state.cart.find(i => i.manga_id === item.manga_id && i.usuario_id === item.usuario_id)
    if (existingItem) {
      try {
        const maxStock = item.mangas?.stock ?? Infinity
        const nuevaCantidad = Math.min(existingItem.cantidad + item.cantidad, maxStock)
        if (nuevaCantidad === existingItem.cantidad) return
        if (item.usuario_id) {
          await updateCartQuantitySupabase(item.usuario_id, item.manga_id, nuevaCantidad)
        }
        const newCart = state.cart.map(i =>
          i.manga_id === item.manga_id
            ? { ...i, cantidad: nuevaCantidad }
            : i
        )
        set({ cart: newCart, totalItems: sumarItems(newCart) })
        if (!item.usuario_id) saveCartToLocalStorage(newCart)
      } catch (error) {
        console.error('Error al actualizar la cantidad del carrito:', error)
      }
    } else {
      try {
        if (item.mangas && item.cantidad > item.mangas.stock) {
          alert(`Solo hay ${item.mangas.stock} unidades disponibles`)
          return
        }
        if (item.usuario_id) {
          await addToCartSupabase(item)
        }
        const newCart = [...state.cart, item]
        set({ cart: newCart, totalItems: sumarItems(newCart) })
        if (!item.usuario_id) saveCartToLocalStorage(newCart)
      } catch (error: unknown) {
        const hasCode = (err: unknown): err is { code: string } =>
          typeof err === 'object' &&
          err !== null &&
          'code' in err &&
          typeof (err as Record<string, unknown>).code === 'string'
        if (hasCode(error) && error.code === '23505') {
          alert('Tienes un conflicto con otro dispositivo. Refresca la página para continuar')
        } else {
          console.error('Error al agregar al carrito:', error)
        }
      }
    }
  },

  removeFromCart: async(manga_id, usuario_id) =>{
    if(usuario_id) await removeFromCartSupabase(manga_id, usuario_id)
    set((state) => {
      const newCart = state.cart.filter((item) => item.manga_id !== manga_id)
      if (!usuario_id) saveCartToLocalStorage(newCart)
      return { cart: newCart, totalItems: sumarItems(newCart) }
    })
  },

  clearCart: async (usuario_id) => {
    if (usuario_id) await clearCartSupabase(usuario_id)
    clearCartFromLocalStorage()
    set({ cart: [], totalItems: 0 })},

  updateQuantity: async (usuario_id, manga_id, cantidad) =>{
    const state = get()
    const item = state.cart.find(i => i.manga_id === manga_id)
    if (!item) return
    const maxStock = item.mangas?.stock ?? Infinity
    const cantidadFinal = Math.max(1, Math.min(cantidad, maxStock))
    if (cantidadFinal === item.cantidad) return
    if (usuario_id) await updateCartQuantitySupabase(usuario_id, manga_id, cantidadFinal)
    set((s) => {
      const newCart = s.cart.map((i) =>
        i.manga_id === manga_id ? { ...i, cantidad: cantidadFinal } : i
      )
      if (!usuario_id) saveCartToLocalStorage(newCart)
      return { cart: newCart, totalItems: sumarItems(newCart) }
    })
  },

  setCart: (items) => {
    set({ cart: items, totalItems: sumarItems(items) })
  },
}))
