import { direccionSchema } from '@/schemas/direccionesSchema'
import { REGIONES_CHILE } from '@/lib/regionesChile'

const datosValidos = {
  nombre_direccion: 'Casa',
  calle: 'Av. Principal',
  numero: '1234',
  comuna: 'Providencia',
  ciudad: 'Santiago',
}

describe('direccionSchema', () => {
  it('acepta datos validos minimos', () => {
    const result = direccionSchema.safeParse(datosValidos)
    expect(result.success).toBe(true)
  })

  it('acepta datos completos con region', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      departamento: '501',
      region: 'Metropolitana de Santiago',
      codigo_postal: '7500000',
    })
    expect(result.success).toBe(true)
  })

  it('acepta region vacia (sin seleccion)', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      region: '',
    })
    expect(result.success).toBe(true)
  })

  it('acepta region undefined (opcional)', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      region: undefined,
    })
    expect(result.success).toBe(true)
  })

  it('rechaza region invalida', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      region: 'Region Inexistente',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza nombre_direccion vacio', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      nombre_direccion: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es obligatorio')
    }
  })

  it('rechaza calle vacia', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      calle: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza numero vacio', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      numero: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza comuna vacia', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      comuna: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza ciudad vacia', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      ciudad: '',
    })
    expect(result.success).toBe(false)
  })

  it('acepta todas las regiones de Chile', () => {
    for (const region of REGIONES_CHILE) {
      const result = direccionSchema.safeParse({
        ...datosValidos,
        region,
      })
      expect(result.success).toBe(true)
    }
  })

  it('departamento es opcional', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      departamento: undefined,
    })
    expect(result.success).toBe(true)
  })

  it('codigo_postal es opcional', () => {
    const result = direccionSchema.safeParse({
      ...datosValidos,
      codigo_postal: undefined,
    })
    expect(result.success).toBe(true)
  })
})
