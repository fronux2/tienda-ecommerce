'use client'
import { CartContextProvider } from '@/context/CartContext'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartContextProvider>
      {children}
    </CartContextProvider>
  )
}