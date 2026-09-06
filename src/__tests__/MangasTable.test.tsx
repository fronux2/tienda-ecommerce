import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MangasTable from '@/components/MangasTable'
import { useMangaStore } from '@/store/mangaStore'
import { updateManga } from '@/lib/supabase/services/mangas.client'
import { crearCategoria, crearManga, crearSerie } from '@/test-utils/fixtures'

jest.mock('@/store/mangaStore', () => ({
  useMangaStore: jest.fn(),
}))

jest.mock('@/lib/supabase/services/mangas.client', () => ({
  updateManga: jest.fn().mockResolvedValue(undefined),
  getMangas: jest.fn().mockResolvedValue([]),
}))

jest.mock('@/lib/formatPrice', () => ({
  formatPrice: (p: number) => `$${p.toLocaleString('es-CL')}`,
}))

const mockLoadMangas = jest.fn().mockResolvedValue(undefined)

const makeManga = crearManga

const mangas = [
  makeManga(),
  makeManga({
    id: 'm-2',
    titulo: 'Berserk',
    autor: 'Miura',
    editorial: 'Hakusensha',
    categoria_id: 'cat-2',
    serie_id: 'ser-2',
    precio: 12990,
    stock: 3,
    isbn: '0987654321',
    fecha_publicacion: '2022-06-15',
    es_popular: false,
    imagen_portada: 'https://img.test/berserk.jpg',
  }),
  makeManga({
    id: 'm-3',
    titulo: 'One Piece',
    autor: 'Oda',
    serie_id: 'ser-3',
    volumen: 100,
    descripcion: 'Aventura pirata',
    precio: 5990,
    stock: 0,
    isbn: '1122334455',
    fecha_publicacion: '2024-03-01',
    estado: 'agotado',
    activo: false,
    imagen_portada: 'https://img.test/op.jpg',
  }),
]

const categorias = [
  crearCategoria({ id: 'cat-1', nombre: 'Shonen' }),
  crearCategoria({ id: 'cat-2', nombre: 'Seinen' }),
]

const series = [
  crearSerie({ id: 'ser-1', nombre: 'Naruto' }),
  crearSerie({ id: 'ser-2', nombre: 'Berserk' }),
  crearSerie({ id: 'ser-3', nombre: 'One Piece' }),
]

type DatosStore = { mangas: typeof mangas; loadMangas: jest.Mock }

const setupStoreMock = (data: DatosStore) => {
  // El store de Zustand no se solapa con jest.Mock: hay que pasar por unknown.
  ;(useMangaStore as unknown as jest.Mock).mockImplementation(
    (selector?: (estado: DatosStore) => unknown) => (selector ? selector(data) : data),
  )
}

beforeEach(() => {
  setupStoreMock({ mangas, loadMangas: mockLoadMangas })
  jest.clearAllMocks()
})

const getTablaBody = () => document.querySelector('tbody')

describe('MangasTable', () => {
  it('renderiza la tabla con todos los mangas', () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('Naruto')
    expect(tbody).toHaveTextContent('Berserk')
    expect(tbody).toHaveTextContent('One Piece')
  })

  it('muestra el total de mangas', () => {
    render(<MangasTable series={series} categorias={categorias} />)
    expect(screen.getByText('Total de mangas:')).toBeInTheDocument()
  })

  it('filtra por termino de busqueda en titulo', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const input = screen.getByPlaceholderText(/Título, autor, editorial/)
    await userEvent.type(input, 'Berserk')
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('Berserk')
    expect(tbody).not.toHaveTextContent('Naruto')
    expect(tbody).not.toHaveTextContent('One Piece')
  })

  it('filtra por autor', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const input = screen.getByPlaceholderText(/Título, autor, editorial/)
    await userEvent.type(input, 'Miura')
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('Berserk')
    expect(tbody).not.toHaveTextContent('Naruto')
  })

  it('filtra por editorial', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const input = screen.getByPlaceholderText(/Título, autor, editorial/)
    await userEvent.type(input, 'Hakusensha')
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('Berserk')
    expect(tbody).not.toHaveTextContent('Naruto')
  })

  it('filtra por categoría', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const select = screen.getByLabelText('Categoría')
    await userEvent.selectOptions(select, 'cat-2')
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('Berserk')
    expect(tbody).not.toHaveTextContent('Naruto')
    expect(tbody).not.toHaveTextContent('One Piece')
  })

  it('filtra por estado agotado', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const select = screen.getByLabelText('Estado')
    await userEvent.selectOptions(select, 'agotado')
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('One Piece')
    expect(tbody).not.toHaveTextContent('Naruto')
  })

  it('filtra por activo No', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const selects = screen.getAllByLabelText('Activo')
    const filtroSelect = selects[0]
    await userEvent.selectOptions(filtroSelect, 'false')
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('One Piece')
    expect(tbody).not.toHaveTextContent('Naruto')
  })

  it('filtra por popular No', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const selects = screen.getAllByLabelText('Popular')
    const filtroSelect = selects[0]
    await userEvent.selectOptions(filtroSelect, 'false')
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('Berserk')
    expect(tbody).not.toHaveTextContent('Naruto')
    expect(tbody).not.toHaveTextContent('One Piece')
  })

  it('muestra badge de busqueda activa', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const input = screen.getByPlaceholderText(/Título, autor, editorial/)
    await userEvent.type(input, 'xyz')
    expect(screen.getByText(/Buscando:.*xyz/)).toBeInTheDocument()
  })

  it('muestra "no hay resultados" cuando busqueda no matchea', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const input = screen.getByPlaceholderText(/Título, autor, editorial/)
    await userEvent.type(input, 'XYZNOEXISTE')
    expect(screen.getByText(/No se encontraron resultados/)).toBeInTheDocument()
  })

  it('muestra "no hay mangas disponibles" cuando no hay datos', () => {
    setupStoreMock({ mangas: [], loadMangas: mockLoadMangas })
    render(<MangasTable series={series} categorias={categorias} />)
    expect(screen.getByText('No hay mangas disponibles')).toBeInTheDocument()
  })

  it('entra en modo edicion al doble clic en titulo', () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const tbody = getTablaBody()
    const celdas = tbody!.querySelectorAll('td')
    const tituloCell = Array.from(celdas).find(
      (td) => td.textContent?.trim() === 'Naruto' && td.querySelector('.cursor-pointer'),
    )
    fireEvent.doubleClick(tituloCell!.querySelector('.cursor-pointer')!)
    const inputs = screen.getAllByRole('textbox')
    const editInput = inputs.find(
      (el) => (el as HTMLInputElement).value === 'Naruto',
    )
    expect(editInput).toBeDefined()
  })

  it('guarda edicion con Enter', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const tbody = getTablaBody()
    const celdas = tbody!.querySelectorAll('td')
    const tituloCell = Array.from(celdas).find(
      (td) => td.textContent?.trim() === 'Naruto' && td.querySelector('.cursor-pointer'),
    )
    fireEvent.doubleClick(tituloCell!.querySelector('.cursor-pointer')!)
    const inputs = screen.getAllByRole('textbox')
    const editInput = inputs.find(
      (el) => (el as HTMLInputElement).value === 'Naruto',
    ) as HTMLInputElement
    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'Naruto Shippuden')
    fireEvent.keyDown(editInput, { key: 'Enter' })
    await waitFor(() => {
      expect(updateManga).toHaveBeenCalledWith('m-1', {
        titulo: 'Naruto Shippuden',
      })
    })
  })

  it('llama loadMangas despues de guardar', async () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const tbody = getTablaBody()
    const celdas = tbody!.querySelectorAll('td')
    const tituloCell = Array.from(celdas).find(
      (td) => td.textContent?.trim() === 'Naruto' && td.querySelector('.cursor-pointer'),
    )
    fireEvent.doubleClick(tituloCell!.querySelector('.cursor-pointer')!)
    const inputs = screen.getAllByRole('textbox')
    const editInput = inputs.find(
      (el) => (el as HTMLInputElement).value === 'Naruto',
    ) as HTMLInputElement
    await userEvent.type(editInput, 'X')
    fireEvent.keyDown(editInput, { key: 'Enter' })
    await waitFor(() => {
      expect(mockLoadMangas).toHaveBeenCalled()
    })
  })

  it('muestra nombre de categoria en la tabla', () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('Shonen')
    expect(tbody).toHaveTextContent('Seinen')
  })

  // El stock se pinta con <Badge variant>, que mapea a tokens semanticos
  // (text-success / text-danger). Antes se buscaban las clases 'green' y 'red',
  // que desaparecieron al pasar al sistema de tokens.
  it('muestra stock con colores segun cantidad', () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const stock15 = screen.getAllByText('15').find(
      (el) => el.className.includes('text-success'),
    )
    const stock0 = screen.getAllByText('0').find(
      (el) => el.className.includes('text-danger'),
    )
    expect(stock15).toBeDefined()
    expect(stock0).toBeDefined()
  })

  it('muestra Sí / No para activo y popular', () => {
    render(<MangasTable series={series} categorias={categorias} />)
    const tbody = getTablaBody()
    expect(tbody).toHaveTextContent('Sí')
    expect(tbody).toHaveTextContent('No')
  })
})
