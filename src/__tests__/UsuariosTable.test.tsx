import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UsuariosTable from '@/components/UsuariosTable'

const mockUsuarios = [
  { id: 'u-1', email: 'admin@test.com', rol_id: '3', roles: [{ id: 3, nombre: 'admin' }] },
  { id: 'u-2', email: 'user@test.com', rol_id: '1', roles: [{ id: 1, nombre: 'cliente' }] },
]

jest.mock('@/store/usuarioStore', () => ({
  useUsuarioStore: jest.fn((selector?: (state: Record<string, unknown>) => unknown) => {
    const state = {
      usuarios: mockUsuarios,
      getUsuarios: jest.fn().mockResolvedValue(undefined),
      updateUsuarioEnStore: jest.fn(),
    }
    return selector ? selector(state) : state
  }),
}))

jest.mock('@/lib/supabase/services/usuarios.client', () => ({
  updateUsuario: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/supabase/services/roles.client', () => ({
  getRoles: jest.fn().mockResolvedValue([
    { id: 1, nombre: 'cliente' },
    { id: 2, nombre: 'moderador' },
    { id: 3, nombre: 'admin' },
  ]),
}))

jest.mock('next/navigation', () => ({ useRouter: jest.fn(() => ({ push: jest.fn() })) }))

const { useUsuarioStore } = jest.requireMock('@/store/usuarioStore')
const { updateUsuario } = jest.requireMock('@/lib/supabase/services/usuarios.client')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('UsuariosTable', () => {
  describe('render', () => {
    it('muestra el titulo', async () => {
      render(<UsuariosTable usuarioRolId={3} />)
      expect(await screen.findByText('Panel de Usuarios')).toBeInTheDocument()
    })

    it('muestra todos los usuarios', async () => {
      render(<UsuariosTable usuarioRolId={3} />)
      await waitFor(() => {
        expect(screen.getByText('admin@test.com')).toBeInTheDocument()
        expect(screen.getByText('user@test.com')).toBeInTheDocument()
      })
    })

    it('muestra los roles por defecto', async () => {
      render(<UsuariosTable usuarioRolId={3} />)
      await waitFor(() => {
        expect(screen.getByText('admin')).toBeInTheDocument()
        expect(screen.getByText('cliente')).toBeInTheDocument()
      })
    })
  })

  describe('edicion inline', () => {
    it('doble clic en email abre input', async () => {
      const user = userEvent.setup()
      render(<UsuariosTable usuarioRolId={3} />)

      await waitFor(() => {
        expect(screen.getByText('admin@test.com')).toBeInTheDocument()
      })

      await user.dblClick(screen.getByText('admin@test.com'))
      const input = screen.getAllByRole('textbox')[0]
      expect(input).toHaveValue('admin@test.com')
    })

    it('modificar email y presionar Enter guarda', async () => {
      const user = userEvent.setup()
      render(<UsuariosTable usuarioRolId={3} />)

      await waitFor(() => {
        expect(screen.getByText('admin@test.com')).toBeInTheDocument()
      })

      await user.dblClick(screen.getByText('admin@test.com'))
      const input = screen.getAllByRole('textbox')[0]
      await user.clear(input)
      await user.type(input, 'nuevo@test.com')
      await user.keyboard('{Enter}')

      expect(updateUsuario).toHaveBeenCalledWith('u-1', { email: 'nuevo@test.com' })
    })

    it('doble clic en rol abre select', async () => {
      const user = userEvent.setup()
      render(<UsuariosTable usuarioRolId={3} />)

      await waitFor(() => {
        expect(screen.getByText('admin')).toBeInTheDocument()
      })

      await user.dblClick(screen.getByText('admin'))
      expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument()
    })
  })

  describe('permisos de rol', () => {
    it('admin puede editar cualquier rol', async () => {
      render(<UsuariosTable usuarioRolId={3} />)
      await waitFor(() => {
        expect(screen.getByText('admin')).toBeInTheDocument()
      })

      // admin cell should NOT be disabled (no text-gray-400 class)
      const adminCell = screen.getByText('admin').closest('td')!
      expect(adminCell.className).not.toContain('text-gray-400')
    })

    it('no-admin no puede editar rol de admin', async () => {
      render(<UsuariosTable usuarioRolId={2} />)
      await waitFor(() => {
        expect(screen.getByText('admin')).toBeInTheDocument()
      })

      const adminCell = screen.getByText('admin').closest('td')!
      expect(adminCell.className).toContain('text-gray-400')
    })
  })

  describe('estado vacio', () => {
    it('muestra nada cuando no hay usuarios', () => {
      useUsuarioStore.mockReturnValue({
        usuarios: [],
        getUsuarios: jest.fn().mockResolvedValue(undefined),
        updateUsuarioEnStore: jest.fn(),
      })

      render(<UsuariosTable usuarioRolId={3} />)

      expect(screen.getAllByRole('row')).toHaveLength(1) // solo thead
    })
  })
})
