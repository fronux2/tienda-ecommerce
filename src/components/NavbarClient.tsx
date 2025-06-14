// app/components/NavbarClient.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { fetchCartFromSupabase } from '@/lib/supabase/services/carrito.cliente'
import { useEffect } from 'react'
import Cart from '@/components/Cart'
type Props = {
  user: object | null
  rolId: number | null
}

export default function NavbarClient({ user, rolId }: Props) {
  const setCart = useCartStore((state) => state.setCart)
  const cart = useCartStore((state) => state.cart)
  
  
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const fetchCart = async () => {
      const items = await fetchCartFromSupabase(user?.id || '')
      setCart(items)
    }
    fetchCart()
  }, [user, setCart])


  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white flex-wrap gap-4 pr-24">
      <Link href="/">Home</Link>
      <Link href="/mangas">Mangas</Link>
      {isHome && (
        <>
          <Link href="#about">Sobre Nosotros</Link>
          <Link href="#section-map">Encuéntranos</Link>
        </>
      )}
      {user && (
        <>
          <form action="/logout" method="post">
            <button type="submit">Logout</button>
          </form>
          {rolId === 2 && <Link href="/admin">Admin</Link>}
          {rolId === 1 && <Link href="/admin">Normal</Link>}
        </>
      )}
      {!user && <Link href="/login">Login</Link>}
      <Cart userId={user?.id} />
    </nav>
  )
}
