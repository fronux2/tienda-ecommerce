import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartPage from '@/app/cart/page'

const mockCart = [
  {
    manga_id: 'm-1',
    usuario_id: 'u-1',
    cantidad: 2,
    mangas: {
      id: 'm-1',
      titulo: 'Naruto Vol. 1',
      precio: 9900,
      imagen_portada: '/img/naruto.jpg',
      stock: 10,
    },
  },
  {
    manga_id: 'm-2',
    usuario_id: 'u-1',
    cantidad: 1,
    mangas: {
      id: 'm-2',
      titulo: 'Berserk Vol. 1',
      precio: 12990,
      imagen_portada: '/img/berserk.jpg',
      stock: 5,
    },
  },
]

const mockRemoveFromCart = jest.fn().mockResolvedValue(undefined)
const mockUpdateQuantity = jest.fn().mockResolvedValue(undefined)
const mockClearCart = jest.fn().mockResolvedValue(undefined)

jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn((selector?: (state: Record<string, unknown>) => unknown) => {
    const state = {
      cart: mockCart,
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
    }
    return selector ? selector(state) : state
  }),
}))

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: { id: 'u-1', email: 'test@test.com' },
    loading: false,
  })),
}))

jest.mock('next/image', () => {
  const MockImage = (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt as string} />
  )
  MockImage.displayName = 'NextImageMock'
  return MockImage
})

jest.mock('next/link', () => (props: Record<string, unknown>) => (
  <a href={props.href as string}>{props.children}</a>
))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))

const { useCartStore } = jest.requireMock('@/store/cartStore')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CartPage', () => {
  describe('carrito con items', () => {
    it('muestra el titulo y conteo de items', () => {
      render(<CartPage />)
      expect(screen.getByText('Tu Carrito')).toBeInTheDocument()
      expect(screen.getByText('3 productos')).toBeInTheDocument()
    })

    it('muestra los titulos de los mangas', () => {
      render(<CartPage />)
      expect(screen.getByText('Naruto Vol. 1')).toBeInTheDocument()
      expect(screen.getByText('Berserk Vol. 1')).toBeInTheDocument()
    })

    it('muestra precios', () => {
      render(<CartPage />)
      // Naruto: 2 × $9.900 = $19.800 subtotal
      expect(screen.getByText('$19.800')).toBeInTheDocument()
      // Berserk: 1 × $12.990 — appears as unit price AND subtotal
      expect(screen.getAllByText('$12.990')).toHaveLength(2)
    })

    it('muestra total', () => {
      render(<CartPage />)
      // Total: 19800 + 12990 = 32790 — appears in summary detail + total line
      expect(screen.getAllByText('$32.790')).toHaveLength(2)
    })

    it('muestra cantidades', () => {
      render(<CartPage />)
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('muestra boton de eliminar por item', () => {
      render(<CartPage />)
      expect(screen.getAllByLabelText('Eliminar del carrito')).toHaveLength(2)
    })

    it('muestra botones +/- de cantidad', () => {
      render(<CartPage />)
      expect(screen.getAllByLabelText('Reducir cantidad')).toHaveLength(2)
      expect(screen.getAllByLabelText('Aumentar cantidad')).toHaveLength(2)
    })

    it('link de detalle apunta al manga correcto', () => {
      render(<CartPage />)
      const links = screen.getAllByText('Naruto Vol. 1')
      expect(links[0]).toHaveAttribute('href', '/mangas/m-1')
    })

    it('boton "Ir a pagar" existe', () => {
      render(<CartPage />)
      expect(screen.getByText('Ir a pagar')).toBeInTheDocument()
    })

    it('boton "Vaciar carrito" existe', () => {
      render(<CartPage />)
      expect(screen.getByText('Vaciar carrito')).toBeInTheDocument()
    })
  })

  describe('acciones', () => {
    it('click en eliminar llama a removeFromCart', async () => {
      const user = userEvent.setup()
      render(<CartPage />)

      const botones = screen.getAllByLabelText('Eliminar del carrito')
      await user.click(botones[0])

      expect(mockRemoveFromCart).toHaveBeenCalledWith('m-1', 'u-1')
    })

    it('click en + llama a updateQuantity con cantidad + 1', async () => {
      const user = userEvent.setup()
      render(<CartPage />)

      const botones = screen.getAllByLabelText('Aumentar cantidad')
      await user.click(botones[0])

      expect(mockUpdateQuantity).toHaveBeenCalledWith('u-1', 'm-1', 3)
    })

    it('click en - llama a updateQuantity con cantidad - 1', async () => {
      const user = userEvent.setup()
      render(<CartPage />)

      const botones = screen.getAllByLabelText('Reducir cantidad')
      await user.click(botones[0])

      expect(mockUpdateQuantity).toHaveBeenCalledWith('u-1', 'm-1', 1)
    })

    it('click en "Vaciar carrito" llama a clearCart', async () => {
      const user = userEvent.setup()
      render(<CartPage />)

      await user.click(screen.getByText('Vaciar carrito'))

      expect(mockClearCart).toHaveBeenCalledWith('u-1')
    })

    it('boton - deshabilitado cuando cantidad es 1', () => {
      // Berserk tiene cantidad 1
      render(<CartPage />)

      // First reducer button (Naruto, cantidad=2) should be enabled
      // Second reducer button (Berserk, cantidad=1) should be disabled
      const botones = screen.getAllByLabelText('Reducir cantidad')
      expect(botones[0]).not.toBeDisabled()
      expect(botones[1]).toBeDisabled()
    })
  })

  describe('carrito vacio', () => {
    it('muestra estado vacio cuando no hay items', () => {
      useCartStore.mockReturnValue({
        cart: [],
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      })

      render(<CartPage />)

      expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
      expect(screen.getByText('Agrega algunos mangas para empezar')).toBeInTheDocument()
    })

    it('muestra link "Explorar mangas" en estado vacio', () => {
      useCartStore.mockReturnValue({
        cart: [],
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      })

      render(<CartPage />)

      const link = screen.getByText('Explorar mangas')
      expect(link).toHaveAttribute('href', '/mangas')
    })
  })
})
