import { useCartStore, CartItem } from '@/store/cartStore'

jest.mock('@/lib/supabase/services/carrito.client', () => ({
  addToCartSupabase: jest.fn().mockResolvedValue(undefined),
  removeFromCartSupabase: jest.fn().mockResolvedValue(undefined),
  updateCartQuantitySupabase: jest.fn().mockResolvedValue(undefined),
  clearCartSupabase: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/cartLocalStorage', () => ({
  saveCartToLocalStorage: jest.fn(),
  clearCartFromLocalStorage: jest.fn(),
  loadCartFromLocalStorage: jest.fn().mockReturnValue([]),
}))

const {
  addToCartSupabase,
  removeFromCartSupabase,
  updateCartQuantitySupabase,
  clearCartSupabase,
} = jest.requireMock('@/lib/supabase/services/carrito.client')

const { saveCartToLocalStorage, clearCartFromLocalStorage } =
  jest.requireMock('@/lib/cartLocalStorage')

beforeEach(() => {
  useCartStore.setState({ cart: [], totalItems: 0 })
  jest.clearAllMocks()
})

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  usuario_id: 'user-1',
  manga_id: 'manga-1',
  cantidad: 1,
  mangas: {
    titulo: 'Naruto',
    precio: 9900,
    imagen_portada: '/naruto.jpg',
    stock: 10,
  },
  ...overrides,
})

describe('cartStore', () => {
  describe('addToCart', () => {
    it('agrega un item nuevo (usuario auth)', async () => {
      const item = makeItem()
      await useCartStore.getState().addToCart(item)

      const { cart, totalItems } = useCartStore.getState()
      expect(cart).toHaveLength(1)
      expect(cart[0].manga_id).toBe('manga-1')
      expect(totalItems).toBe(1)
      expect(addToCartSupabase).toHaveBeenCalledWith(item)
      expect(saveCartToLocalStorage).not.toHaveBeenCalled()
    })

    it('agrega un item nuevo (guest, sin usuario_id)', async () => {
      const item = makeItem({ usuario_id: null })
      await useCartStore.getState().addToCart(item)

      const { cart } = useCartStore.getState()
      expect(cart).toHaveLength(1)
      expect(addToCartSupabase).not.toHaveBeenCalled()
      expect(saveCartToLocalStorage).toHaveBeenCalled()
    })

    it('suma cantidad cuando el item ya existe en el carrito', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 2 })],
        totalItems: 2,
      })

      await useCartStore.getState().addToCart(makeItem({ cantidad: 1 }))

      const { cart, totalItems } = useCartStore.getState()
      expect(cart).toHaveLength(1)
      expect(cart[0].cantidad).toBe(3)
      expect(totalItems).toBe(3)
      expect(updateCartQuantitySupabase).toHaveBeenCalledWith(
        'user-1',
        'manga-1',
        3,
      )
    })

    it('limita cantidad al stock cuando se excede', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 8 })],
        totalItems: 8,
      })

      await useCartStore.getState().addToCart(makeItem({ cantidad: 5 }))

      const { cart } = useCartStore.getState()
      expect(cart[0].cantidad).toBe(10)
    })

    it('no modifica si ya esta en stock maximo', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 10 })],
        totalItems: 10,
      })

      await useCartStore.getState().addToCart(makeItem({ cantidad: 1 }))

      const { cart, totalItems } = useCartStore.getState()
      expect(cart[0].cantidad).toBe(10)
      expect(totalItems).toBe(10)
      expect(updateCartQuantitySupabase).not.toHaveBeenCalled()
    })

    it('no agrega item nuevo si cantidad supera stock', async () => {
      const item = makeItem({ cantidad: 20 })
      await useCartStore.getState().addToCart(item)

      const { cart } = useCartStore.getState()
      expect(cart).toHaveLength(0)
    })

    it('trata items sin mangas como stock infinito', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 5, mangas: undefined })],
        totalItems: 5,
      })

      await useCartStore.getState().addToCart(
        makeItem({ cantidad: 100, mangas: undefined }),
      )

      const { cart } = useCartStore.getState()
      expect(cart[0].cantidad).toBe(105)
    })

    it('maneja error 23505 (conflicto unique)', async () => {
      addToCartSupabase.mockRejectedValueOnce({ code: '23505' })
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

      await useCartStore.getState().addToCart(makeItem())

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('conflicto'),
      )
      alertSpy.mockRestore()
    })
  })

  describe('removeFromCart', () => {
    it('elimina un item (usuario auth)', async () => {
      useCartStore.setState({
        cart: [makeItem({ manga_id: 'm-1' }), makeItem({ manga_id: 'm-2' })],
        totalItems: 2,
      })

      await useCartStore.getState().removeFromCart('m-1', 'user-1')

      const { cart, totalItems } = useCartStore.getState()
      expect(cart).toHaveLength(1)
      expect(cart[0].manga_id).toBe('m-2')
      expect(totalItems).toBe(1)
      expect(removeFromCartSupabase).toHaveBeenCalledWith('m-1', 'user-1')
    })

    it('elimina un item (guest)', async () => {
      useCartStore.setState({
        cart: [makeItem({ manga_id: 'm-1', usuario_id: null })],
        totalItems: 1,
      })

      await useCartStore.getState().removeFromCart('m-1', null)

      const { cart } = useCartStore.getState()
      expect(cart).toHaveLength(0)
      expect(removeFromCartSupabase).not.toHaveBeenCalled()
      expect(saveCartToLocalStorage).toHaveBeenCalled()
    })
  })

  describe('clearCart', () => {
    it('limpia todo el carrito (usuario auth)', async () => {
      useCartStore.setState({
        cart: [makeItem(), makeItem({ manga_id: 'm-2' })],
        totalItems: 2,
      })

      await useCartStore.getState().clearCart('user-1')

      const { cart, totalItems } = useCartStore.getState()
      expect(cart).toEqual([])
      expect(totalItems).toBe(0)
      expect(clearCartSupabase).toHaveBeenCalledWith('user-1')
      expect(clearCartFromLocalStorage).toHaveBeenCalled()
    })

    it('limpia todo el carrito (guest)', async () => {
      useCartStore.setState({
        cart: [makeItem({ usuario_id: null })],
        totalItems: 1,
      })

      await useCartStore.getState().clearCart(null)

      const { cart, totalItems } = useCartStore.getState()
      expect(cart).toEqual([])
      expect(totalItems).toBe(0)
      expect(clearCartSupabase).not.toHaveBeenCalled()
    })
  })

  describe('updateQuantity', () => {
    it('actualiza la cantidad a un valor valido', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 2 })],
        totalItems: 2,
      })

      await useCartStore.getState().updateQuantity('user-1', 'manga-1', 5)

      const { cart, totalItems } = useCartStore.getState()
      expect(cart[0].cantidad).toBe(5)
      expect(totalItems).toBe(5)
      expect(updateCartQuantitySupabase).toHaveBeenCalledWith(
        'user-1',
        'manga-1',
        5,
      )
    })

    it('clampea a 1 cuando la cantidad es menor', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 3 })],
        totalItems: 3,
      })

      await useCartStore.getState().updateQuantity('user-1', 'manga-1', 0)

      expect(useCartStore.getState().cart[0].cantidad).toBe(1)
    })

    it('clampea a 1 con cantidad negativa', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 3 })],
        totalItems: 3,
      })

      await useCartStore.getState().updateQuantity('user-1', 'manga-1', -5)

      expect(useCartStore.getState().cart[0].cantidad).toBe(1)
    })

    it('clampea al stock maximo', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 5 })],
        totalItems: 5,
      })

      await useCartStore.getState().updateQuantity('user-1', 'manga-1', 100)

      expect(useCartStore.getState().cart[0].cantidad).toBe(10)
    })

    it('no modifica si el item no existe', async () => {
      useCartStore.setState({
        cart: [makeItem({ manga_id: 'other' })],
        totalItems: 1,
      })

      await useCartStore.getState().updateQuantity('user-1', 'manga-1', 5)

      const { cart, totalItems } = useCartStore.getState()
      expect(cart).toHaveLength(1)
      expect(cart[0].manga_id).toBe('other')
      expect(totalItems).toBe(1)
    })

    it('no modifica si la cantidad es la misma', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 5 })],
        totalItems: 5,
      })

      await useCartStore.getState().updateQuantity('user-1', 'manga-1', 5)

      expect(updateCartQuantitySupabase).not.toHaveBeenCalled()
      expect(useCartStore.getState().cart[0].cantidad).toBe(5)
    })

    it('guarda en localStorage para guest', async () => {
      useCartStore.setState({
        cart: [makeItem({ cantidad: 2, usuario_id: null })],
        totalItems: 2,
      })

      await useCartStore.getState().updateQuantity(null, 'manga-1', 5)

      expect(saveCartToLocalStorage).toHaveBeenCalled()
      expect(updateCartQuantitySupabase).not.toHaveBeenCalled()
    })
  })

  describe('setCart', () => {
    it('reemplaza el carrito y calcula totalItems', () => {
      const items = [
        makeItem({ manga_id: 'm-1', cantidad: 3 }),
        makeItem({ manga_id: 'm-2', cantidad: 2 }),
      ]

      useCartStore.getState().setCart(items)

      const { cart, totalItems } = useCartStore.getState()
      expect(cart).toHaveLength(2)
      expect(totalItems).toBe(5)
    })

    it('totalItems es 0 con carrito vacio', () => {
      useCartStore.getState().setCart([])

      expect(useCartStore.getState().totalItems).toBe(0)
    })
  })
})
