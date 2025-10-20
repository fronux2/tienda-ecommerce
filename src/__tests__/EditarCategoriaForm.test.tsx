import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditarCategoriaForm from '../components/forms/editarCategoriaForm'

// Creamos mocks para cada función encadenada
const mockEq = jest.fn().mockResolvedValue({ error: null })
const mockUpdate = jest.fn(() => ({ eq: mockEq }))
const mockFrom = jest.fn(() => ({ update: mockUpdate }))

jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}))

// Mock del router
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}))

describe('EditarCategoriaForm', () => {
  const categoria = { id: '1', name: 'Categoría Original' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza el formulario con el valor inicial', () => {
    render(<EditarCategoriaForm categoria={categoria} />)
    const input = screen.getByLabelText(/nombre/i) as HTMLInputElement
    expect(input.value).toBe('Categoría Original')
  })

  it('muestra error si el campo está vacío', async () => {
    render(<EditarCategoriaForm categoria={categoria} />)
    const input = screen.getByLabelText(/nombre/i)

    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }))

    expect(await screen.findByText(/el nombre es obligatorio/i)).toBeInTheDocument()
    expect(mockEq).not.toHaveBeenCalled()
  })

  it('actualiza la categoría correctamente', async () => {
    render(<EditarCategoriaForm categoria={categoria} />)
    const input = screen.getByLabelText(/nombre/i)

    fireEvent.change(input, { target: { value: 'Nueva Categoría' } })
    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }))

    await waitFor(() => {
      expect(mockEq).toHaveBeenCalledWith('id', categoria.id)
    })

    expect(await screen.findByText(/categoría actualizada correctamente/i)).toBeInTheDocument()
    expect(mockRefresh).toHaveBeenCalled()
  })
})
