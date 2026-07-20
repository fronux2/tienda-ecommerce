import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SeriesTable from '@/components/SeriesTable'
import { updateSerie } from '@/lib/supabase/services/series.client'

jest.mock('@/lib/supabase/services/series.client', () => ({
  updateSerie: jest.fn().mockResolvedValue(undefined),
}))

const series = [
  { id: 'ser-1', nombre: 'One Piece' },
  { id: 'ser-2', nombre: 'Naruto' },
  { id: 'ser-3', nombre: 'Berserk' },
]

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SeriesTable', () => {
  it('renderiza todas las series', () => {
    render(<SeriesTable series={series} />)

    expect(screen.getByText('One Piece')).toBeInTheDocument()
    expect(screen.getByText('Naruto')).toBeInTheDocument()
    expect(screen.getByText('Berserk')).toBeInTheDocument()
  })

  it('muestra el total de series', () => {
    render(<SeriesTable series={series} />)

    expect(screen.getByText('Total de series:')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('filtra series por nombre', async () => {
    render(<SeriesTable series={series} />)

    const input = screen.getByPlaceholderText('Buscar por nombre o ID...')
    await userEvent.type(input, 'Naruto')

    expect(screen.getByText('Naruto')).toBeInTheDocument()
    expect(screen.queryByText('One Piece')).not.toBeInTheDocument()
    expect(screen.queryByText('Berserk')).not.toBeInTheDocument()
  })

  it('filtra series por ID', async () => {
    render(<SeriesTable series={series} />)

    const input = screen.getByPlaceholderText('Buscar por nombre o ID...')
    await userEvent.type(input, 'ser-1')

    expect(screen.getByText('One Piece')).toBeInTheDocument()
    expect(screen.queryByText('Naruto')).not.toBeInTheDocument()
  })

  it('muestra mensaje cuando no hay resultados con busqueda', async () => {
    render(<SeriesTable series={series} />)

    const input = screen.getByPlaceholderText('Buscar por nombre o ID...')
    await userEvent.type(input, 'Inexistente')

    expect(
      screen.getByText(/No se encontraron series para/),
    ).toBeInTheDocument()
  })

  it('limpia la busqueda con el boton X', async () => {
    render(<SeriesTable series={series} />)

    const input = screen.getByPlaceholderText('Buscar por nombre o ID...')
    await userEvent.type(input, 'Naruto')

    const botonLimpiar = screen.getByText('✕')
    fireEvent.click(botonLimpiar)

    expect(screen.getByText('One Piece')).toBeInTheDocument()
    expect(screen.getByText('Naruto')).toBeInTheDocument()
    expect(screen.getByText('Berserk')).toBeInTheDocument()
  })

  it('entra en modo edicion al hacer doble clic', () => {
    render(<SeriesTable series={series} />)

    fireEvent.doubleClick(screen.getByText('One Piece'))

    const inputs = screen.getAllByRole('textbox')
    const editInput = inputs.find(
      (el) => (el as HTMLInputElement).value === 'One Piece',
    )
    expect(editInput).toBeDefined()
    expect(editInput).toHaveValue('One Piece')
  })

  it('actualiza la serie al guardar con Enter', async () => {
    render(<SeriesTable series={series} />)

    fireEvent.doubleClick(screen.getByText('One Piece'))

    const inputs = screen.getAllByRole('textbox')
    const editInput = inputs.find(
      (el) => (el as HTMLInputElement).value === 'One Piece',
    ) as HTMLInputElement

    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'One Piece Shippuden')
    fireEvent.keyDown(editInput, { key: 'Enter' })

    await waitFor(() => {
      expect(updateSerie).toHaveBeenCalledWith('ser-1', {
        nombre: 'One Piece Shippuden',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('One Piece Shippuden')).toBeInTheDocument()
    })
  })

  it('muestra empty state cuando no hay series', () => {
    render(<SeriesTable series={[]} />)

    expect(screen.getByText('No hay series disponibles')).toBeInTheDocument()
    expect(screen.getByText('Recargar datos')).toBeInTheDocument()
  })
})
