import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CrearCategoriaForm from '../components/forms/crearCategoriaFrorm'
import { crearCategoria } from '../components/actions/categorias'

jest.mock('../components/actions/categorias', () => ({
  crearCategoria: jest.fn(),
}))

describe('CrearCategoriaForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza el formulario correctamente', () => {
    render(<CrearCategoriaForm />)

    expect(screen.getByText(/crear categoría/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear categoría/i })).toBeInTheDocument()
  })

  it('muestra error si el nombre está vacío', async () => {
    render(<CrearCategoriaForm />)

    fireEvent.click(screen.getByRole('button', { name: /crear categoría/i }))

    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument()
    expect(crearCategoria).not.toHaveBeenCalled()
  })

  it('envía el formulario con datos válidos', async () => {
    render(<CrearCategoriaForm />)

    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Bebidas' },
    })

    fireEvent.click(screen.getByRole('button', { name: /crear categoría/i }))

    await waitFor(() => {
      expect(crearCategoria).toHaveBeenCalledWith({ name: 'Bebidas' })
    })
  })
})
