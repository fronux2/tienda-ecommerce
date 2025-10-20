"use client"
import { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useCartStore } from '@/store/cartStore'

const CheckoutPage = () => {
  const supabase = useMemo(() => createClient(), [])

  type Address = {
    id: string
    usuario_id?: string
    nombre_direccion: string
    direccion: string
    ciudad: string
    codigo_postal?: string
  }

  const [addressId, setAddressId] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    nombre_direccion: '',
    direccion: '',
    ciudad: '',
    codigo_postal: ''
  })

  const {
    cart,
    clearCart,
  } = useCartStore()

  const total = cart.reduce((acc, item) => acc + item.cantidad * (item.mangas?.precio ?? 0), 0)

  const fetchAddresses = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('direcciones')
      .select('*')
      .eq('usuario_id', userId)

    if (!error && data) {
      setAddresses(data)
    }
  }, [supabase])

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      if (user?.id) fetchAddresses(user.id)
    }
    fetchUser()
  }, [fetchAddresses, supabase])

  const handleAddAddress = async () => {
    if (!userId) return alert('Usuario no identificado')

    const { error } = await supabase.from('direcciones').insert([
      {
        usuario_id: userId,
        ...newAddress
      }
    ])

    if (error) {
      console.error('Error al agregar dirección', error)
      alert('No se pudo agregar la dirección')
    } else {
      alert('Dirección agregada correctamente')
      setShowAddressForm(false)
      setNewAddress({
        nombre_direccion: '',
        direccion: '',
        ciudad: '',
        codigo_postal: ''
      })
      fetchAddresses(userId)
    }
  }

  const handleCheckout = async () => {
    console.log('handleCheckout', userId)
    setLoading(true)

    try {
      console.log(userId, addressId, total, paymentMethod)
      const { data: order, error: orderError } = await supabase
        .from('pedidos')
        .insert([{
          usuario_id: userId,
          direccion_id: addressId,
          total,
          metodo_pago: paymentMethod,
          estado: 'pendiente'
        }])
        .select('*')

      console.log('order', order)
      if (orderError) throw orderError

      const orderDetails = cart
        .filter(item => item.mangas)
        .map(item => ({
          pedido_id: order[0].id,
          manga_id: item.mangas?.id ?? '',
          cantidad: item.cantidad,
          precio_unitario: item.mangas?.precio ?? 0
        }))

      const { error: detailsError } = await supabase
        .from('detalle_pedidos')
        .insert(orderDetails)

      if (detailsError) throw detailsError


      // Filtrar items sin 'mangas' y usar aserción no-nula para acceder al id
      const stockUpdates = cart
        .filter(item => item.mangas)
        .map(item =>
          supabase.rpc('decrement_stock', {
            manga_id: item.mangas!.id,
            decrement_by: item.cantidad
          })
        )

      await Promise.all(stockUpdates)

      await supabase
        .from('carrito')
        .update({ checked_out: true, fecha_checkout: new Date() })
        .eq('usuario_id', userId)
        .eq('checked_out', false)

      if (userId) clearCart(userId)

      //window.location.href = `/order-confirmed/${order.id}`

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

        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowAddressForm(!showAddressForm)}
        >
          {showAddressForm ? 'Cancelar' : 'Agregar nueva dirección'}
        </button>

        {showAddressForm && (
          <div className="border p-4 rounded mb-4">
            <input
              type="text"
              placeholder="Nombre de dirección Casa/Trabajo/departamento de mi mama, etc."
              value={newAddress.nombre_direccion}
              onChange={(e) => setNewAddress({ ...newAddress, nombre_direccion: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={newAddress.direccion}
              onChange={(e) => setNewAddress({ ...newAddress, direccion: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={newAddress.ciudad}
              onChange={(e) => setNewAddress({ ...newAddress, ciudad: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Código postal"
              value={newAddress.codigo_postal}
              onChange={(e) => setNewAddress({ ...newAddress, codigo_postal: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />
            <button
              onClick={handleAddAddress}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar dirección
            </button>
          </div>
        )}

        {/* Selector de dirección */}
        {addresses.length > 0 ? (
          <select
            value={addressId}
            onChange={(e) => setAddressId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona una dirección</option>
            {addresses.map(addr => (
              <option key={addr.id} value={addr.id}>
                {addr.nombre_direccion} - {addr.direccion}, {addr.ciudad}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-600">No tienes direcciones registradas.</p>
        )}
      </div>

      {/* Resumen del pedido */}
      <div className="border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
        {cart.map(item => {
          const title = item.mangas?.titulo ?? 'Manga desconocido'
          const price = item.mangas?.precio ?? 0
          return (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{title} x {item.cantidad}</span>
              <span>${(item.cantidad * price).toFixed(2)}</span>
            </div>
          )
        })}
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
