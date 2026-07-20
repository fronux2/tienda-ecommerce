import { nuevoMangaSchema } from '@/schemas/mangasSchema'

const datosValidos = {
  titulo: 'Naruto',
  autor: 'Masashi Kishimoto',
  editorial: 'Shueisha',
  categoria_id: '550e8400-e29b-41d4-a716-446655440000',
  serie_id: '550e8400-e29b-41d4-a716-446655440001',
  volumen: 1,
  descripcion: 'Primer volumen de Naruto',
  precio: 29990,
  stock: 50,
  isbn: '9784088728407',
  numero_paginas: 200,
  idioma: 'Japones',
  fecha_publicacion: '2023-01-01',
  estado: 'disponible',
  activo: true,
}

describe('nuevoMangaSchema', () => {
  it('acepta datos validos', () => {
    const result = nuevoMangaSchema.safeParse(datosValidos)
    expect(result.success).toBe(true)
  })

  it('acepta campos opcionales ausentes', () => {
    const { imagen_portada, fecha_creacion, es_popular, ...required } =
      datosValidos
    const result = nuevoMangaSchema.safeParse(required)
    expect(result.success).toBe(true)
  })

  it('rechaza titulo vacio', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      titulo: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza autor vacio', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      autor: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza isbn menor a 10 caracteres', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      isbn: '123456789',
    })
    expect(result.success).toBe(false)
  })

  it('acepta isbn de exactamente 10 caracteres', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      isbn: '1234567890',
    })
    expect(result.success).toBe(true)
  })

  it('acepta isbn de 13 caracteres (ISBN-13)', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      isbn: '9781234567890',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza precio negativo', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      precio: -1000,
    })
    expect(result.success).toBe(false)
  })

  it('acepta precio cero', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      precio: 0,
    })
    expect(result.success).toBe(true)
  })

  it('rechaza stock negativo', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      stock: -5,
    })
    expect(result.success).toBe(false)
  })

  it('rechaza stock float', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      stock: 5.5,
    })
    expect(result.success).toBe(false)
  })

  it('rechaza categoria_id que no es UUID', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      categoria_id: 'not-a-uuid',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza serie_id que no es UUID', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      serie_id: 'not-a-uuid',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza numero_paginas cero', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      numero_paginas: 0,
    })
    expect(result.success).toBe(false)
  })

  it('rechaza numero_paginas float', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      numero_paginas: 10.5,
    })
    expect(result.success).toBe(false)
  })

  it('rechaza volumen negativo', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      volumen: -1,
    })
    expect(result.success).toBe(false)
  })

  it('rechaza idioma vacio', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      idioma: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza descripcion vacia', () => {
    const result = nuevoMangaSchema.safeParse({
      ...datosValidos,
      descripcion: '',
    })
    expect(result.success).toBe(false)
  })
})
