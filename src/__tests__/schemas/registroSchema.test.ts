import { registroSchema } from '@/schemas/registroSchema'

// Contrasena que cumple todas las reglas: 10+ caracteres, mayuscula,
// minuscula, numero y simbolo.
const PASSWORD_VALIDA = 'mangaNihon1!'

const datos = (over: Partial<Record<'email' | 'password' | 'confirmar_password', string>> = {}) => ({
  email: 'test@example.com',
  password: PASSWORD_VALIDA,
  confirmar_password: PASSWORD_VALIDA,
  ...over,
})

const esperaErrorEn = (campo: string, entrada: ReturnType<typeof datos>) => {
  const result = registroSchema.safeParse(entrada)
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues.some((i) => i.path.includes(campo))).toBe(true)
  }
}

describe('registroSchema', () => {
  it('acepta datos validos', () => {
    const result = registroSchema.safeParse(datos())
    expect(result.success).toBe(true)
  })

  describe('email', () => {
    it('rechaza email invalido', () => {
      esperaErrorEn('email', datos({ email: 'noemail' }))
    })

    it('rechaza email vacio', () => {
      esperaErrorEn('email', datos({ email: '' }))
    })
  })

  describe('reglas de contrasena', () => {
    it('rechaza menos de 10 caracteres', () => {
      esperaErrorEn('password', datos({ password: 'Manga1!', confirmar_password: 'Manga1!' }))
    })

    it('rechaza sin mayuscula', () => {
      esperaErrorEn('password', datos({ password: 'manganihon1!', confirmar_password: 'manganihon1!' }))
    })

    it('rechaza sin minuscula', () => {
      esperaErrorEn('password', datos({ password: 'MANGANIHON1!', confirmar_password: 'MANGANIHON1!' }))
    })

    it('rechaza sin numero', () => {
      esperaErrorEn('password', datos({ password: 'mangaNihon!!', confirmar_password: 'mangaNihon!!' }))
    })

    it('rechaza sin simbolo', () => {
      esperaErrorEn('password', datos({ password: 'mangaNihon12', confirmar_password: 'mangaNihon12' }))
    })
  })

  describe('confirmacion', () => {
    it('rechaza confirmar_password vacio', () => {
      esperaErrorEn('confirmar_password', datos({ confirmar_password: '' }))
    })

    it('rechaza cuando las contrasenas no coinciden', () => {
      const result = registroSchema.safeParse(datos({ confirmar_password: 'otraClave9$' }))
      expect(result.success).toBe(false)
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path.includes('confirmar_password'))
        expect(confirmError).toBeDefined()
        expect(confirmError!.message).toMatch(/coinciden/i)
      }
    })
  })
})
