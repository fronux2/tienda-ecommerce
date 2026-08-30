'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  FaChevronRight, FaChevronLeft,
  FaHome, FaShoppingBag, FaMapMarkerAlt, FaUser
} from 'react-icons/fa'

const menuItems = [
  { href: '/perfil', label: 'Dashboard', icon: <FaHome className="text-lg" /> },
  { href: '/perfil/pedidos', label: 'Mis Pedidos', icon: <FaShoppingBag className="text-lg" /> },
  { href: '/perfil/direcciones', label: 'Direcciones', icon: <FaMapMarkerAlt className="text-lg" /> },
  { href: '/perfil/datos', label: 'Mis Datos', icon: <FaUser className="text-lg" /> },
]

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <div className="min-h-screen bg-ink flex flex-col md:flex-row">
      <button
        type="button"
        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        className={`fixed top-0 bottom-0 z-20 w-6 bg-chrome flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
          isMenuOpen ? 'left-64' : 'left-0'
        }`}
        onClick={toggleMenu}
      >
        <div className="text-chrome-foreground hover:text-primary-light transition-colors">
          {isMenuOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </div>
      </button>

      <aside
        className={`fixed top-0 bottom-0 z-10 bg-surface shadow-lg transition-all duration-300 ${
          isMenuOpen ? 'left-0 w-64' : '-left-64 w-64'
        }`}
      >
        <nav className="p-4 h-full overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 text-center border-b-2 border-primary pb-2">
            {isMenuOpen && 'Mi Cuenta'}
          </h2>
          <ul className="flex flex-col gap-y-2">
            {menuItems.map((item) => {
              const activo = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
                      activo
                        ? 'bg-cream text-primary font-semibold'
                        : 'hover:bg-cream hover:text-primary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {isMenuOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ${
          isMenuOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          <div className="bg-surface rounded-xl border-2 border-ink shadow-lg p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
