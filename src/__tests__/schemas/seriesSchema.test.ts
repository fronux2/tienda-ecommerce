import { seriesSchema } from '@/schemas/seriesSchema'

const datosValidos = {
  nombre: 'One Piece',
  descripcion: 'Aventura epica en el mar',
  autor: 'Eiichiro Oda',
  estado: 'activo',
  imagen_serie: 'https://example.com/onepiece.jpg',
}

describe('seriesSchema', () => {
  it('acepta datos validos', () => {
    const result = seriesSchema.safeParse(datosValidos)
    expect(result.success).toBe(true)
  })

  it('rechaza nombre vacio', () => {
    const result = seriesSchema.safeParse({
      ...datosValidos,
      nombre: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es obligatorio')
    }
  })

  it('rechaza descripcion vacia', () => {
    const result = seriesSchema.safeParse({
      ...datosValidos,
      descripcion: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza autor vacio', () => {
    const result = seriesSchema.safeParse({
      ...datosValidos,
      autor: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza estado vacio', () => {
    const result = seriesSchema.safeParse({
      ...datosValidos,
      estado: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza imagen_serie que no es URL', () => {
    const result = seriesSchema.safeParse({
      ...datosValidos,
      imagen_serie: 'no-es-url',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Debe ser una URL válida')
    }
  })

  it('rechaza imagen_serie sin protocolo', () => {
    const result = seriesSchema.safeParse({
      ...datosValidos,
      imagen_serie: 'example.com/image.jpg',
    })
    expect(result.success).toBe(false)
  })

  it('acepta imagen_serie con https', () => {
    const result = seriesSchema.safeParse({
      ...datosValidos,
      imagen_serie: 'https://example.com/series.png',
    })
    expect(result.success).toBe(true)
  })
})
