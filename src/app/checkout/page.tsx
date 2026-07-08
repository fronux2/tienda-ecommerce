"use client"
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/formatPrice'
import { direccionSchema } from '@/schemas/direccionesSchema'

const SNAPSHOT_KEY = 'webpay_pending_order'

const CheckoutPage = () => {
  const supabase = useMemo(() => createClient(), [])

  type Address = {
    id: string
    usuario_id?: string
    nombre_direccion: string
    direccion: string
    numero_casa: string
    ciudad: string
    codigo_postal?: string
  }

  const [addressId, setAddressId] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    nombre_direccion: '',
    direccion: '',
    numero_casa: '',
    ciudad: '',
    codigo_postal: ''
  })

  const {
    cart,
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
      setUserEmail(user?.email || null)
      if (user?.id) fetchAddresses(user.id)
    }
    fetchUser()
  }, [fetchAddresses, supabase])

  const [savingAddress, setSavingAddress] = useState(false)

  const handleAddAddress = async () => {
    if (!userId) return alert('Usuario no identificado')
    if (savingAddress) return
    const parsed = direccionSchema.safeParse(newAddress)
    if (!parsed.success) {
      alert(parsed.error.errors[0].message)
      return
    }
    setSavingAddress(true)

    const { data, error } = await supabase
      .from('direcciones')
      .insert([{ usuario_id: userId, ...newAddress }])
      .select('*')

    if (error) {
      console.error('Error al agregar dirección', error)
      alert('No se pudo agregar la dirección')
    } else if (data?.[0]) {
      setAddressId(data[0].id)
      setShowAddressForm(false)
      setNewAddress({
        nombre_direccion: '',
        direccion: '',
        numero_casa: '',
        ciudad: '',
        codigo_postal: ''
      })
      fetchAddresses(userId)
    }
    setSavingAddress(false)
  }

  const webpayLoading = useRef(false)

  const handleWebpayPayment = async () => {
    if (!userId) return alert('Usuario no identificado')
    if (!addressId) return alert('Selecciona una dirección de envío')
    if (webpayLoading.current) return

    webpayLoading.current = true
    setLoading(true)

    try {
      const buyOrder = `TM-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      const returnUrl = `${window.location.origin}/webpay/resultado`

      const direccionSel = addresses.find(a => a.id === addressId)
      const direccionStr = direccionSel
        ? `${direccionSel.nombre_direccion} - ${direccionSel.direccion} #${direccionSel.numero_casa}, ${direccionSel.ciudad}`
        : ''

      const snapshot = {
        items: cart
          .filter(item => item.mangas)
          .map(item => ({
            manga_id: item.mangas!.id ?? item.manga_id,
            cantidad: item.cantidad,
            precio: item.mangas!.precio,
            titulo: item.mangas!.titulo,
          })),
        total,
        direccion_id: addressId,
        direccionStr,
        userEmail: userEmail || '',
        buyOrder,
      }

      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot))

      const res = await fetch('/api/webpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyOrder,
          sessionId: userId,
          amount: total,
          returnUrl,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al crear la transacción')
      }

      const { token, url } = await res.json()

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = url
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'token_ws'
      input.value = token
      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()

    } catch (error) {
      localStorage.removeItem(SNAPSHOT_KEY)
      setLoading(false)
      webpayLoading.current = false
      console.error('Webpay error:', error)
      alert('Error al iniciar el pago')
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
              placeholder="N° Casa"
              value={newAddress.numero_casa}
              onChange={(e) => setNewAddress({ ...newAddress, numero_casa: e.target.value })}
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
              disabled={savingAddress}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              {savingAddress ? 'Guardando...' : 'Guardar dirección'}
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
                {addr.nombre_direccion} - {addr.direccion} #{addr.numero_casa}, {addr.ciudad}
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
              <span>{formatPrice(item.cantidad * price)}</span>
            </div>
          )
        })}
        <div className="flex justify-between mt-4 pt-4 border-t">
          <span className="font-bold">Total:</span>
          <span className="font-bold">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Método de pago */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💳</div>
            <div>
              <p className="font-semibold">Webpay Plus</p>
              <p className="text-sm text-gray-600">Tarjetas de crédito y débito</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleWebpayPayment}
        disabled={loading || !addressId}
        className="w-full px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
      >
        {loading ? 'Conectando con Webpay...' : `Pagar con Webpay — ${formatPrice(total)}`}
      </button>
    </div>
  )
}

export default CheckoutPage
