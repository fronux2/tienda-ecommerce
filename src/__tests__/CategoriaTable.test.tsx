import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoriaTable from '@/components/CategoriaTable'
import { updateCategoria } from '@/lib/supabase/services/categorias.client'

jest.mock('@/lib/supabase/services/categorias.client', () => ({
  updateCategoria: jest.fn().mockResolvedValue(undefined),
}))

const categorias = [
  { id: 'cat-1', nombre: 'Shonen' },
  { id: 'cat-2', nombre: 'Seinen' },
  { id: 'cat-3', nombre: 'Kodomo' },
]

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CategoriaTable', () => {
  it('renderiza todas las categorias', () => {
    render(<CategoriaTable categorias={categorias} />)

    expect(screen.getByText('Shonen')).toBeInTheDocument()
    expect(screen.getByText('Seinen')).toBeInTheDocument()
    expect(screen.getByText('Kodomo')).toBeInTheDocument()
  })

  it('muestra headers ID y Nombre', () => {
    render(<CategoriaTable categorias={categorias} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
  })

  it('muestra el titulo del panel', () => {
    render(<CategoriaTable categorias={categorias} />)

    expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
  })

  it('entra en modo edicion al hacer doble clic en nombre', () => {
    render(<CategoriaTable categorias={categorias} />)

    const celdaNombre = screen.getByText('Shonen')
    fireEvent.doubleClick(celdaNombre)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Shonen')
  })

  it('actualiza la categoria al guardar con Enter', async () => {
    render(<CategoriaTable categorias={categorias} />)

    fireEvent.doubleClick(screen.getByText('Shonen'))

    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Shonen Modificado')
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(updateCategoria).toHaveBeenCalledWith('cat-1', {
        nombre: 'Shonen Modificado',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Shonen Modificado')).toBeInTheDocument()
    })
  })

  it('actualiza la categoria al guardar con blur', async () => {
    render(<CategoriaTable categorias={categorias} />)

    fireEvent.doubleClick(screen.getByText('Seinen'))

    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Seinen Nuevo')
    fireEvent.blur(input)

    await waitFor(() => {
      expect(updateCategoria).toHaveBeenCalledWith('cat-2', {
        nombre: 'Seinen Nuevo',
      })
    })
  })

  it('llama updateCategoria aunque el valor sea igual (sin guard de cambios)', async () => {
    render(<CategoriaTable categorias={categorias} />)

    fireEvent.doubleClick(screen.getByText('Shonen'))

    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(updateCategoria).toHaveBeenCalledWith('cat-1', {
        nombre: 'Shonen',
      })
    })
  })

  it('maneja error de Supabase sin crashear', async () => {
    ;(updateCategoria as jest.Mock).mockRejectedValueOnce(
      new Error('DB error'),
    )
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<CategoriaTable categorias={categorias} />)

    fireEvent.doubleClick(screen.getByText('Shonen'))

    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Fallara')
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  it('renderiza tabla vacia sin crashear', () => {
    render(<CategoriaTable categorias={[]} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(1)
  })
})
