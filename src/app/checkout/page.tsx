"use client"
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { createClient } from '@/utils/supabase/client'

const CheckoutPage = () => {
  const supabase = createClient()  
  
  const [addressId, setAddressId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const { cartItems, total, clearCart } = useCart(userId || null)
  useEffect(() => {
      const fetchUser = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUserId(user?.id || null)
        setLoadingUser(false)
      }
      fetchUser()
    }, [])

  const handleCheckout = async () => {
    setLoading(true)
    
    try {
      // Crear pedido
      const { data: order, error: orderError } = await supabase
        .from('pedidos')
        .insert([{
          usuario_id: user.id,
          direccion_id: addressId,
          total,
          metodo_pago: paymentMethod,
          estado: 'pendiente'
        }])
        .single()

      if (orderError) throw orderError

      // Crear detalles del pedido
      const orderDetails = cartItems.map(item => ({
        pedido_id: order.id,
        manga_id: item.mangas.id,
        cantidad: item.cantidad,
        precio_unitario: item.mangas.precio
      }))

      const { error: detailsError } = await supabase
        .from('detalle_pedidos')
        .insert(orderDetails)

      if (detailsError) throw detailsError

      // Actualizar stock
      const stockUpdates = cartItems.map(item => 
        supabase.rpc('decrement_stock', {
          manga_id: item.mangas.id,
          decrement_by: item.cantidad
        })
      )

      await Promise.all(stockUpdates)

      // Marcar carrito como completado
      await supabase
        .from('carrito')
        .update({ checked_out: true, fecha_checkout: new Date() })
        .eq('usuario_id', user.id)
        .eq('checked_out', false)

      // Limpiar carrito localmente
      clearCart()
      
      // Redirigir a confirmación
      window.location.href = `/order-confirmed/${order.id}`
      
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
      
      {/* Sección de dirección */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
        {/* Selector de direcciones aquí */}
      </div>
      
      {/* Resumen del pedido */}
      <div className="border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.mangas.titulo} x {item.cantidad}</span>
            <span>${(item.cantidad * item.mangas.precio).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 pt-4 border-t">
          <span className="font-bold">Total:</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Método de pago */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
        <select 
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="tarjeta">Tarjeta de Crédito</option>
          <option value="paypal">PayPal</option>
          <option value="transferencia">Transferencia Bancaria</option>
        </select>
      </div>
      
      <button
        onClick={handleCheckout}
        disabled={loading || !addressId}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
    </div>
  )
}

export default CheckoutPage