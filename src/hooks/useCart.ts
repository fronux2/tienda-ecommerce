"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export const useCart = (userId: string | null) => {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  // Cargar carrito inicial
  useEffect(() => {
    if (userId) fetchCart()
  }, [userId])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('carrito')
        .select(`
          id, 
          cantidad,
          mangas (id, titulo, precio, imagen_portada, stock)
        `)
        .eq('usuario_id', userId)
        .eq('checked_out', false)

      if (error) throw error
      setCartItems(data || [])
      calculateTotal(data || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = (items: any[]) => {
    const total = items.reduce((sum, item) => {
      return sum + (item.cantidad * item.mangas.precio)
    }, 0)
    setTotal(Number(total.toFixed(2)))
  }

  const addToCart = async (mangaId: string) => {
    if (!userId) return
    
    // Verificar stock
    const { data: manga } = await supabase
      .from('mangas')
      .select('stock')
      .eq('id', mangaId)
      .single()

    if (!manga || manga.stock < 1) {
      alert('Producto sin stock')
      return
    }

    // Añadir o actualizar
    const existingItem = cartItems.find(item => item.mangas.id === mangaId)
    
    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.cantidad + 1)
    } else {
      const { error } = await supabase
        .from('carrito')
        .insert([{ 
          usuario_id: userId, 
          manga_id: mangaId,
          cantidad: 1 
        }])
      
      if (!error) fetchCart()
    }
  }

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return removeFromCart(cartItemId)
    
    // Verificar stock máximo
    const cartItem = cartItems.find(item => item.id === cartItemId)
    if (cartItem && newQuantity > cartItem.mangas.stock) {
      alert('No hay suficiente stock')
      return
    }

    const { error } = await supabase
      .from('carrito')
      .update({ cantidad: newQuantity })
      .eq('id', cartItemId)

    if (!error) fetchCart()
  }

  const removeFromCart = async (cartItemId: number) => {
    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('id', cartItemId)

    if (!error) fetchCart()
  }

  const clearCart = async () => {
    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('usuario_id', userId)
      .eq('checked_out', false)

    if (!error) setCartItems([])
  }

  return {
    cartItems,
    total,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
}