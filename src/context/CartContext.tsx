'use client'
import { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { addToCartSupabase, clearCartSupabase, removeFromCartSupabase, updateCartQuantitySupabase } from '@/lib/supabase/services/carrito.cliente'

type Manga = {
  id: string
  titulo: string
  precio: number
  imagen_portada: string
  stock: number
}

type CartItem = {
  id?: string
  usuario_id: string | null
  manga_id: string
  mangas?: Manga
  cantidad: number
}

type CartContextType = {
  cart: CartItem[]
  loading: boolean
  error: string | null
  addToCart: (item: CartItem) => Promise<void>
  removeFromCart: (manga_id: string, usuario_id: string) => Promise<void>
  clearCart: (usuario_id: string) => Promise<void>
  updateQuantity: (usuario_id: string, manga_id: string, cantidad: number) => Promise<void>
  syncCart: (usuario_id: string) => Promise<void>
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartContextProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncCart = useCallback(async (userId: string) => {
    if (!userId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('carrito')
        .select(`*, mangas(*)`)
        .eq('usuario_id', userId)
      
      if (error) throw error
      setCart(data || [])
    } catch (err) {
      setError('Error al sincronizar carrito')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    const channel = supabase
      .channel('realtime-cart')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'carrito'
      }, (payload) => {
        const userId = supabase.auth.getUser()?.id
        if (userId && payload.new.usuario_id === userId) {
          syncCart(userId)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, syncCart])

  const addToCart = useCallback(async (item: CartItem) => {
    setLoading(true)
    try {
      const existingItem = cart.find(i => 
        i.manga_id === item.manga_id && 
        i.usuario_id === item.usuario_id
      )

      if (existingItem) {
        const nuevaCantidad = existingItem.cantidad + item.cantidad
        await updateCartQuantitySupabase(
          item.usuario_id as string, 
          item.manga_id, 
          nuevaCantidad
        )
        await syncCart(item.usuario_id as string)
      } else {
        await addToCartSupabase(item)
        await syncCart(item.usuario_id as string)
      }
    } catch (err: any) {
      if (err.code === '23505') {
        setError('Conflicto detectado. Por favor refresca la página.')
      } else {
        setError('Error al actualizar el carrito')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [cart, syncCart])

  const removeFromCart = useCallback(async (manga_id: string, usuario_id: string) => {
    if (!usuario_id) return
    
    setLoading(true)
    try {
      await removeFromCartSupabase(manga_id, usuario_id)
      await syncCart(usuario_id)
    } catch (err) {
      setError('Error al eliminar del carrito')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [syncCart])

  const clearCart = useCallback(async (usuario_id: string) => {
    if (!usuario_id) return
    
    setLoading(true)
    try {
      await clearCartSupabase(usuario_id)
      await syncCart(usuario_id)
    } catch (err) {
      setError('Error al vaciar el carrito')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [syncCart])

  const updateQuantity = useCallback(async (usuario_id: string, manga_id: string, cantidad: number) => {
    if (!usuario_id) return
    
    setLoading(true)
    try {
      await updateCartQuantitySupabase(usuario_id, manga_id, cantidad)
      await syncCart(usuario_id)
    } catch (err) {
      setError('Error al actualizar cantidad')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [syncCart])

  const totalItems = useMemo(() => 
    cart.reduce((total, item) => total + item.cantidad, 0), 
    [cart]
  )

  const totalPrice = useMemo(() =>
    cart.reduce((total, item) => 
      total + (item.mangas?.precio || 0) * item.cantidad, 0),
    [cart]
  )

  const value = useMemo(() => ({
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    syncCart,
    totalItems,
    totalPrice
  }), [cart, loading, error, addToCart, removeFromCart, clearCart, updateQuantity, syncCart, totalItems, totalPrice])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}