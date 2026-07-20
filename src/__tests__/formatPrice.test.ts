import { formatPrice } from '@/lib/formatPrice'

describe('formatPrice', () => {
  it('formatea precio normal en CLP', () => {
    expect(formatPrice(29960)).toBe('$29.960')
  })

  it('formatea precio cero', () => {
    expect(formatPrice(0)).toBe('$0')
  })

  it('formatea precio unitario', () => {
    expect(formatPrice(1)).toBe('$1')
  })

  it('formatea precio grande', () => {
    expect(formatPrice(999999)).toBe('$999.999')
  })

  it('formatea precio con separador de miles', () => {
    expect(formatPrice(1000)).toBe('$1.000')
  })

  it('formatea precio con miles y centenas', () => {
    expect(formatPrice(15990)).toBe('$15.990')
  })

  it('formatea precio muy grande', () => {
    expect(formatPrice(999999999)).toBe('$999.999.999')
  })
})
