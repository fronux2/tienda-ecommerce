import { useUsuarioStore } from '@/store/usuarioStore'

jest.mock('@/lib/supabase/services/usuarios.client', () => ({
  getUsuarios: jest.fn().mockResolvedValue([
    { id: 'u-1', email: 'admin@test.com', rol_id: '3', roles: [{ id: 3, nombre: 'admin' }] },
    { id: 'u-2', email: 'user@test.com', rol_id: '1', roles: [{ id: 1, nombre: 'cliente' }] },
  ]),
}))

const { getUsuarios: fetchUsuarios } = jest.requireMock(
  '@/lib/supabase/services/usuarios.client',
)

beforeEach(() => {
  useUsuarioStore.setState({ usuarios: null })
  jest.clearAllMocks()
})

describe('usuarioStore', () => {
  describe('getUsuarios', () => {
    it('carga usuarios desde Supabase', async () => {
      await useUsuarioStore.getState().getUsuarios()

      const { usuarios } = useUsuarioStore.getState()
      expect(usuarios).toHaveLength(2)
      expect(usuarios![0].email).toBe('admin@test.com')
      expect(fetchUsuarios).toHaveBeenCalledTimes(1)
    })

    it('inicia con usuarios en null', () => {
      expect(useUsuarioStore.getState().usuarios).toBeNull()
    })
  })

  describe('updateUsuarioEnStore', () => {
    it('actualiza un campo generico', async () => {
      await useUsuarioStore.getState().getUsuarios()

      useUsuarioStore.getState().updateUsuarioEnStore(
        'u-2',
        'email',
        'nuevo@test.com',
      )

      const user = useUsuarioStore
        .getState()
        .usuarios!.find((u) => u.id === 'u-2')
      expect(user!.email).toBe('nuevo@test.com')
    })

    it('actualiza rol_id y roles array', async () => {
      await useUsuarioStore.getState().getUsuarios()

      useUsuarioStore.getState().updateUsuarioEnStore(
        'u-2',
        'rol_id',
        '2',
        { '1': 'cliente', '2': 'moderador', '3': 'admin' },
      )

      const user = useUsuarioStore
        .getState()
        .usuarios!.find((u) => u.id === 'u-2')
      expect(user!.rol_id).toBe('2')
      expect(user!.roles).toEqual([{ id: 2, nombre: 'moderador' }])
    })

    it('rol_id sin rolesMap usa nombre vacio', async () => {
      await useUsuarioStore.getState().getUsuarios()

      useUsuarioStore.getState().updateUsuarioEnStore(
        'u-2',
        'rol_id',
        '2',
      )

      const user = useUsuarioStore
        .getState()
        .usuarios!.find((u) => u.id === 'u-2')
      expect(user!.roles).toEqual([{ id: 2, nombre: '' }])
    })

    it('no modifica otros usuarios', async () => {
      await useUsuarioStore.getState().getUsuarios()

      useUsuarioStore.getState().updateUsuarioEnStore(
        'u-2',
        'email',
        'cambiado@test.com',
      )

      const admin = useUsuarioStore
        .getState()
        .usuarios!.find((u) => u.id === 'u-1')
      expect(admin!.email).toBe('admin@test.com')
    })

    it('no crashea cuando usuarios es null', () => {
      expect(() => {
        useUsuarioStore.getState().updateUsuarioEnStore(
          'u-1',
          'email',
          'test@test.com',
        )
      }).not.toThrow()

      expect(useUsuarioStore.getState().usuarios).toBeNull()
    })
  })
})
