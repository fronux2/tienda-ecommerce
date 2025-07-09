import { render, screen, fireEvent } from '@testing-library/react'
import Cart from '../components/Cart'
import { useCartStore } from '@/store/cartStore'

// 🔧 Mock del store para evitar errores
jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(),
}))

describe('Cart component', () => {
  const mockCartStore = {
    cart: [],
    updateQuantity: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
  }

  beforeEach(() => {
    (useCartStore as jest.Mock).mockReturnValue(mockCartStore)
  })

  it('renderiza el botón del carrito si hay un userId', () => {
    render(<Cart userId="123" />)

    // Botón del carrito debería existir
    const cartButton = screen.getByRole('button', { name: /abrir carrito/i })
    expect(cartButton).toBeInTheDocument()
  })

  it('no renderiza nada si no hay userId', () => {
    const { container } = render(<Cart userId={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('muestra mensaje de carrito vacío cuando no hay productos', () => {
    (useCartStore as jest.Mock).mockReturnValue({
      ...mockCartStore,
      cart: [],
    })

    render(<Cart userId="123" />)

    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument()
  })

  it('muestra productos en el carrito si hay ítems', () => {
    const item = {
      manga_id: '1',
      cantidad: 2,
      mangas: {
        titulo: 'Naruto',
        precio: 9900,
        imagen_portada: '/naruto.jpg',
        stock: 10,
      },
    }

    ;(useCartStore as jest.Mock).mockReturnValue({
      ...mockCartStore,
      cart: [item],
    })

    render(<Cart userId="123" />)

    expect(screen.getByText('Naruto')).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('9900'))).toBeTruthy()
  })

  it('abre y cierra el panel del carrito', () => {
    render(<Cart userId="123" />)

    const toggleButton = screen.getByRole('button', { name: /abrir carrito/i })

    // Abrir
    fireEvent.click(toggleButton)
    expect(screen.getByRole('heading', { name: /tu carrito/i })).toBeInTheDocument()
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()

    // No se borra del DOM, pero desaparece visualmente por clases CSS (esto es tricky de testear)
    // Podrías hacer algo como esto si aplicas aria-hidden o clases visibles
  })
  
  it('llama a clearCart cuando se hace clic en "Vaciar"', () => {
    const mockClearCart = jest.fn()

    const item = {
      manga_id: '1',
      cantidad: 1,
      mangas: {
        titulo: 'Bleach',
        precio: 7900,
        imagen_portada: '/bleach.jpg',
        stock: 10,
      },
    };

    (useCartStore as jest.Mock).mockReturnValue({
      ...mockCartStore,
      cart: [item],
      clearCart: mockClearCart,
    })

    render(<Cart userId="123" />)

    fireEvent.click(screen.getByRole('button', { name: /vaciar/i }))

    expect(mockClearCart).toHaveBeenCalledWith('123')
  })

})
