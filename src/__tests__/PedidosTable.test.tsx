import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PedidosTable from '@/components/PedidosTable'
import getPedidos, { updatePedido } from '@/lib/supabase/services/pedidos.client'

jest.mock('@/lib/supabase/services/pedidos.client', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue([]),
  updatePedido: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('@/lib/formatPrice', () => ({
  formatPrice: (p: number) => `$${p.toLocaleString('es-CL')}`,
}))

const pedidos = [
  {
    id: 'ped-1',
    usuario_id: 'user-1',
    direccion_id: 'dir-1',
    total: 29990,
    estado: 'pendiente',
    metodo_pago: 'Webpay',
    webpay_token: 'token-abc-123',
    buy_order: 'TM-001',
    notas_pedido: 'Entregar en la tarde',
    fecha_pedido: '2024-06-01T10:00:00',
    fecha_actualizacion: '2024-06-01T10:00:00',
    usuarios: { email: 'cliente@test.com' },
    direcciones: {
      nombre_direccion: 'Casa',
      calle: 'Av. Principal',
      numero: '1234',
      comuna: 'Providencia',
      ciudad: 'Santiago',
    },
  },
  {
    id: 'ped-2',
    usuario_id: 'user-2',
    direccion_id: 'dir-2',
    total: 15990,
    estado: 'entregado',
    metodo_pago: 'Webpay',
    webpay_token: null,
    buy_order: 'TM-002',
    notas_pedido: null,
    fecha_pedido: '2024-05-15T08:00:00',
    fecha_actualizacion: '2024-05-20T12:00:00',
    usuarios: { email: 'otro@test.com' },
    direcciones: {
      nombre_direccion: 'Oficina',
      calle: 'Calle Falsa',
      numero: '567',
      comuna: 'Las Condes',
      ciudad: 'Santiago',
    },
  },
  {
    id: 'ped-3',
    usuario_id: 'user-3',
    direccion_id: 'dir-3',
    total: 8990,
    estado: 'enviado',
    metodo_pago: 'Webpay',
    webpay_token: 'token-def-456',
    buy_order: 'TM-003',
    notas_pedido: 'Llamar antes de llegar',
    fecha_pedido: '2024-06-10T14:00:00',
    fecha_actualizacion: '2024-06-11T09:00:00',
    usuarios: { email: 'tercero@test.com' },
    direcciones: null,
  },
]

beforeEach(() => {
  ;(getPedidos as jest.Mock).mockResolvedValue(pedidos)
  jest.clearAllMocks()
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  })
})

afterEach(() => {
  jest.restoreAllMocks()
  delete (global as Record<string, unknown>).fetch
})

describe('PedidosTable', () => {
  it('carga y renderiza pedidos', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('ped-1')).toBeInTheDocument()
    })

    expect(screen.getByText('ped-2')).toBeInTheDocument()
    expect(screen.getByText('ped-3')).toBeInTheDocument()
  })

  it('muestra el total de pedidos', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText(/Total de pedidos: 3/)).toBeInTheDocument()
    })
  })

  it('muestra email del usuario', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('cliente@test.com')).toBeInTheDocument()
    })

    expect(screen.getByText('otro@test.com')).toBeInTheDocument()
    expect(screen.getByText('tercero@test.com')).toBeInTheDocument()
  })

  it('muestra direccion formateada', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(
        screen.getByText(/Casa - Av. Principal #1234, Providencia/),
      ).toBeInTheDocument()
    })
  })

  it('filtra por busqueda global en email', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('ped-1')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText(/ID, email, dirección/)
    await userEvent.type(input, 'cliente@test.com')

    expect(screen.getByText('ped-1')).toBeInTheDocument()
    expect(screen.queryByText('ped-2')).not.toBeInTheDocument()
    expect(screen.queryByText('ped-3')).not.toBeInTheDocument()
  })

  it('filtra por busqueda en estado', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('ped-1')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText(/ID, email, dirección/)
    await userEvent.type(input, 'enviado')

    expect(screen.getByText('ped-3')).toBeInTheDocument()
    expect(screen.queryByText('ped-1')).not.toBeInTheDocument()
  })

  it('filtra por estado via select', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('ped-1')).toBeInTheDocument()
    })

    const select = screen.getByLabelText('Estado')
    await userEvent.selectOptions(select, 'pendiente')

    expect(screen.getByText('ped-1')).toBeInTheDocument()
    expect(screen.queryByText('ped-2')).not.toBeInTheDocument()
    expect(screen.queryByText('ped-3')).not.toBeInTheDocument()
  })

  it('ordena pendientes primero', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('ped-1')).toBeInTheDocument()
    })

    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('ped-1')
  })

  it('muestra badge de filtro activo y permite limpiar', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('ped-1')).toBeInTheDocument()
    })

    const select = screen.getByLabelText('Estado')
    await userEvent.selectOptions(select, 'entregado')

    expect(screen.getByText(/Estado: entregado/)).toBeInTheDocument()

    const clearBtn = screen.getByText('✕')
    fireEvent.click(clearBtn)

    expect(screen.queryByText(/Estado: entregado/)).not.toBeInTheDocument()
  })

  it('muestra "no hay pedidos" cuando no hay datos y no hay filtros', async () => {
    ;(getPedidos as jest.Mock).mockResolvedValue([])

    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('No hay pedidos disponibles')).toBeInTheDocument()
    })
  })

  it('no muestra "no hay pedidos" cuando hay filtros activos', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('ped-1')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText(/ID, email, dirección/)
    await userEvent.type(input, 'XYZNOEXISTE')

    expect(screen.queryByText('No hay pedidos disponibles')).not.toBeInTheDocument()
  })

  it('muestra buy_order', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('TM-001')).toBeInTheDocument()
    })

    expect(screen.getByText('TM-002')).toBeInTheDocument()
    expect(screen.getByText('TM-003')).toBeInTheDocument()
  })

  it('muestra "-" cuando webpay_token es null', async () => {
    render(<PedidosTable />)

    await waitFor(() => {
      expect(screen.getByText('ped-2')).toBeInTheDocument()
    })

    const dashElements = screen.getAllByText('-')
    expect(dashElements.length).toBeGreaterThanOrEqual(1)
  })
})
