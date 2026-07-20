import { loginSchema } from '@/schemas/loginSchema'

describe('loginSchema', () => {
  it('acepta datos validos', () => {
    const result = loginSchema.safeParse({
      email: 'user@test.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza email invalido', () => {
    const result = loginSchema.safeParse({
      email: 'invalido',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza password menor a 6 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'user@test.com',
      password: '12345',
    })
    expect(result.success).toBe(false)
  })

  it('acepta password exactamente de 6 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'user@test.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })
})
