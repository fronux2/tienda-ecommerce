'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { fetchCartFromSupabase, addToCartSupabase } from '@/lib/supabase/services/carrito.cliente'
import { loadCartFromLocalStorage, clearCartFromLocalStorage } from '@/lib/cartLocalStorage'
import { useEffect, useState, useRef } from 'react'
import Cart from '@/components/Cart'

type Props = {
  user: { id: string; email?: string } | null
  rolId: number | null
}

export default function NavbarClient({ user, rolId }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const setCart = useCartStore((state) => state.setCart)

  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const initCart = async () => {
      if (user?.id) {
        const guestCart = loadCartFromLocalStorage()
        if (guestCart.length > 0) {
          for (const item of guestCart) {
            await addToCartSupabase({ ...item, usuario_id: user.id })
          }
          clearCartFromLocalStorage()
        }
        const items = await fetchCartFromSupabase(user.id)
        setCart(items)
      } else {
        setCart(loadCartFromLocalStorage())
      }
    }
    initCart()
  }, [user?.id, setCart])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
              <NavLink href="/cart">Carrito</NavLink>
              
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
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-[#FFF8F0] hover:text-red-500 transition-colors py-2 px-3 rounded-md font-medium text-lg"
                  >
                    <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold text-white">
                      {user.email?.[0]?.toUpperCase() || user.id[0].toUpperCase()}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.email || user.id}</p>
                      </div>
                      <Link
                        href="/perfil"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-red-600 transition-colors"
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        href="/perfil/pedidos"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-red-600 transition-colors"
                      >
                        Mis Pedidos
                      </Link>
                      <Link
                        href="/perfil/direcciones"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-red-600 transition-colors"
                      >
                        Mis Direcciones
                      </Link>
                      {rolId! >= 2 && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#FFF8F0] hover:text-red-600 transition-colors border-t border-gray-100"
                        >
                          Panel Admin
                        </Link>
                      )}
                      <form action="/logout" method="post">
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
                          Cerrar sesión
                        </button>
                      </form>
                    </div>
                  )}
                </div>
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
            <NavLink href="/cart">Carrito</NavLink>
            
            {isHome && (
              <>
                <NavLink href="#about">Sobre Nosotros</NavLink>
                <NavLink href="#section-map">Encuéntranos</NavLink>
              </>
            )}
            
            <div className="border-t border-gray-700 pt-4">
              {user ? (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Mi Cuenta</p>
                  <NavLink href="/perfil">Mi Perfil</NavLink>
                  <NavLink href="/perfil/pedidos">Mis Pedidos</NavLink>
                  <NavLink href="/perfil/direcciones">Mis Direcciones</NavLink>
                  {rolId! >= 2 && <NavLink href="/admin">Panel Admin</NavLink>}
                  <form action="/logout" method="post">
                    <Button type="submit">Cerrar sesión</Button>
                  </form>
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

function Button({ type = 'button', disabled = false, children }: { type?: "button" | "submit" | "reset"; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button 
      type={type}
      disabled={disabled}
      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer text-lg border border-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}