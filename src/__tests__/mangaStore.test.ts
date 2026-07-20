import { useMangaStore } from '@/store/mangaStore'

jest.mock('@/lib/supabase/services/mangas.client', () => ({
  getMangas: jest.fn().mockResolvedValue([
    { id: 'm-1', titulo: 'Naruto', precio: 9900 },
    { id: 'm-2', titulo: 'Berserk', precio: 12990 },
  ]),
  getMangasPopulares: jest.fn().mockResolvedValue([
    { id: 'm-1', titulo: 'Naruto', precio: 9900 },
    { id: 'm-3', titulo: 'One Piece', precio: 5990 },
  ]),
}))

const { getMangas, getMangasPopulares } = jest.requireMock(
  '@/lib/supabase/services/mangas.client',
)

beforeEach(() => {
  useMangaStore.setState({ mangas: [] })
  jest.clearAllMocks()
})

describe('mangaStore', () => {
  describe('setMangas', () => {
    it('reemplaza el array de mangas', () => {
      useMangaStore.getState().setMangas([
        { id: 'm-1', titulo: 'Naruto' },
      ] as never)

      expect(useMangaStore.getState().mangas).toHaveLength(1)
      expect(useMangaStore.getState().mangas[0].titulo).toBe('Naruto')
    })

    it('limpia mangas anteriores', () => {
      useMangaStore.setState({
        mangas: [{ id: 'm-1', titulo: 'Old' }] as never,
      })

      useMangaStore.getState().setMangas([
        { id: 'm-2', titulo: 'New' },
      ] as never)

      expect(useMangaStore.getState().mangas).toHaveLength(1)
      expect(useMangaStore.getState().mangas[0].titulo).toBe('New')
    })
  })

  describe('addMangas', () => {
    it('agrega mangas nuevos al array', () => {
      useMangaStore.getState().addMangas([
        { id: 'm-1', titulo: 'Naruto' },
      ] as never)

      expect(useMangaStore.getState().mangas).toHaveLength(1)
    })

    it('filtra duplicados por id', () => {
      useMangaStore.setState({
        mangas: [{ id: 'm-1', titulo: 'Naruto' }] as never,
      })

      useMangaStore.getState().addMangas([
        { id: 'm-1', titulo: 'Naruto Updated' },
        { id: 'm-2', titulo: 'Berserk' },
      ] as never)

      const { mangas } = useMangaStore.getState()
      expect(mangas).toHaveLength(2)
      expect(mangas.find((m) => m.id === 'm-1')!.titulo).toBe('Naruto')
    })

    it('no modifica el array si todos son duplicados', () => {
      useMangaStore.setState({
        mangas: [{ id: 'm-1' }, { id: 'm-2' }] as never,
      })

      useMangaStore.getState().addMangas([
        { id: 'm-1' },
        { id: 'm-2' },
      ] as never)

      expect(useMangaStore.getState().mangas).toHaveLength(2)
    })
  })

  describe('loadMangas', () => {
    it('carga todos los mangas desde Supabase', async () => {
      await useMangaStore.getState().loadMangas()

      const { mangas } = useMangaStore.getState()
      expect(mangas).toHaveLength(2)
      expect(mangas[0].titulo).toBe('Naruto')
      expect(getMangas).toHaveBeenCalledTimes(1)
    })

    it('reemplaza mangas existentes', async () => {
      useMangaStore.setState({
        mangas: [{ id: 'old', titulo: 'Old' }] as never,
      })

      await useMangaStore.getState().loadMangas()

      expect(useMangaStore.getState().mangas).toHaveLength(2)
      expect(
        useMangaStore.getState().mangas.find((m) => m.id === 'old'),
      ).toBeUndefined()
    })
  })

  describe('loadMangasPopulares', () => {
    it('carga mangas populares y los mergea', async () => {
      await useMangaStore.getState().loadMangasPopulares()

      const { mangas } = useMangaStore.getState()
      expect(mangas).toHaveLength(2)
      expect(getMangasPopulares).toHaveBeenCalledTimes(1)
    })

    it('no duplica mangas ya existentes', async () => {
      useMangaStore.setState({
        mangas: [{ id: 'm-1', titulo: 'Naruto' }] as never,
      })

      await useMangaStore.getState().loadMangasPopulares()

      const { mangas } = useMangaStore.getState()
      expect(mangas).toHaveLength(2)
    })
  })
})
