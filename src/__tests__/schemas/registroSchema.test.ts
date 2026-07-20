import { registroSchema } from '@/schemas/registroSchema'

describe('registroSchema', () => {
  it('acepta datos validos', () => {
    const result = registroSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      confirmar_password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza email invalido', () => {
    const result = registroSchema.safeParse({
      email: 'noemail',
      password: '123456',
      confirmar_password: '123456',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email')
    }
  })

  it('rechaza password menor a 6 caracteres', () => {
    const result = registroSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
      confirmar_password: '12345',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password')
    }
  })

  it('rechaza confirmar_password vacio', () => {
    const result = registroSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      confirmar_password: '',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza cuando las contrasenas no coinciden', () => {
    const result = registroSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
      confirmar_password: '654321',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const confirmError = result.error.issues.find(
        (i) => i.path.includes('confirmar_password'),
      )
      expect(confirmError).toBeDefined()
      expect(confirmError!.message).toMatch(/coinciden/i)
    }
  })

  it('rechaza email vacio', () => {
    const result = registroSchema.safeParse({
      email: '',
      password: '123456',
      confirmar_password: '123456',
    })
    expect(result.success).toBe(false)
  })
})
