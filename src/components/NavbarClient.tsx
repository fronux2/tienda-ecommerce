// app/components/NavbarClient.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { fetchCartFromSupabase } from '@/lib/supabase/services/carrito.cliente'
import { useEffect, useState } from 'react'
import Cart from '@/components/Cart'

type Props = {
  user: { id: string } | null
  rolId: number | null
}

export default function NavbarClient({ user, rolId }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const setCart = useCartStore((state) => state.setCart)
  //const cart = useCartStore((state) => state.cart)
  
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const fetchCart = async () => {
      const items = await fetchCartFromSupabase(user?.id || '')
      setCart(items)
    }
    fetchCart()
  }, [user, setCart])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden'
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = 'auto'
  }

  const NavLink: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ href, children, className }) => {
    const baseClasses = "text-[#FFF8F0] hover:text-red-500 transition-colors py-2 px-3 rounded-md font-medium text-lg";
    const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

    return (
      <Link 
        href={href} 
        className={combinedClasses}
        onClick={closeMenu}
      >
        {children}
      </Link>
    );
  };

  const Button: React.FC<{ type?: "button" | "submit" | "reset"; children: React.ReactNode }> = ({ type = 'button', children }) => (
    <button 
      type={type} 
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer text-lg border border-red-700"
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Navbar principal */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black border-b-2 border-red-600 shadow-lg' 
          : 'bg-black'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo y menú hamburguesa */}
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className="md:hidden text-[#FFF8F0] focus:outline-none mr-4"
                aria-label="Toggle menu"
              >
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <Link href="/" className="text-xl font-bold text-[#FFF8F0]">
                MangaNihon
              </Link>
            </div>

            {/* Menú desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/mangas">Mangas</NavLink>
              
              {isHome && (
                <>
                  <NavLink href="#about">Sobre Nosotros</NavLink>
                  <NavLink href="#section-map">Encuéntranos</NavLink>
                </>
              )}
            </div>

            {/* Elementos de la derecha (desktop) */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <form action="/logout" method="post" className="hidden md:block">
                    <Button type="submit">Cerrar sesión</Button>
                  </form>
                  {rolId === 2 && <NavLink href="/admin" className="hidden md:block">Admin</NavLink>}
                  {rolId === 1 && <NavLink href="/admin" className="hidden md:block">Normal</NavLink>}
                </>
              ) : (
                <NavLink href="/login" className="hidden md:block">Iniciar sesión</NavLink>
              )}
              
              {/* Carrito visible en todos los dispositivos */}
              <Cart userId={user?.id ?? null} />
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div 
          className={`md:hidden fixed inset-0 bg-black z-40 transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out`}
        >
          {/* Botón de cierre en la esquina superior derecha */}
          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 text-[#FFF8F0] focus:outline-none z-50"
            aria-label="Cerrar menú"
          >
            <svg 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col h-full pt-16 px-6 space-y-6 overflow-y-auto">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/mangas">Mangas</NavLink>
            
            {isHome && (
              <>
                <NavLink href="#about">Sobre Nosotros</NavLink>
                <NavLink href="#section-map">Encuéntranos</NavLink>
              </>
            )}
            
            <div className="border-t border-gray-700 pt-4">
              {user ? (
                <div className="space-y-4">
                  <form action="/logout" method="post">
                    <Button type="submit">Cerrar sesión</Button>
                  </form>
                  {rolId === 2 && <NavLink href="/admin">Admin</NavLink>}
                  {rolId === 1 && <NavLink href="/admin">Normal</NavLink>}
                </div>
              ) : (
                <NavLink href="/login">Iniciar sesión</NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Espacio para el navbar fijo */}
      <div className="h-16"></div>
    </>
  )
}