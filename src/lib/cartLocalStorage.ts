import { CartItem } from '@/store/cartStore'

const STORAGE_KEY = 'guest_cart'

export const saveCartToLocalStorage = (cart: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }
}

export const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored) as CartItem[]
      } catch {
        return []
      }
    }
  }
  return []
}

export const clearCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}
