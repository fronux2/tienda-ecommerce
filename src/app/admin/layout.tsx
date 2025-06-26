'use client'
import Link from "next/link"
import { useState } from "react"
import { FaChevronRight, FaChevronLeft, FaHome, FaUsers, FaBook, FaTags, FaListAlt, FaShoppingBag } from "react-icons/fa"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { href: "/admin", label: "Inicio Admin", icon: <FaHome className="text-lg" /> },
    { href: "/admin/usuarios", label: "Usuarios", icon: <FaUsers className="text-lg" /> },
    { href: "/admin/mangas", label: "Mangas", icon: <FaBook className="text-lg" /> },
    { href: "/admin/categorias", label: "Categorias", icon: <FaTags className="text-lg" /> },
    { href: "/admin/series", label: "Serie", icon: <FaListAlt className="text-lg" /> },
    { href: "/admin/pedidos", label: "Pedidos", icon: <FaShoppingBag className="text-lg" /> }
  ]

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      {/* Barra de toggle */}
      <div 
        className={`fixed top-0 bottom-0 z-20 w-6 bg-black flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isMenuOpen ? 'left-64' : 'left-0'
        }`}
        onClick={toggleMenu}
      >
        <div className="text-[#FFF8F0] hover:text-red-500 transition-colors">
          {isMenuOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 z-10 bg-white shadow-lg transition-all duration-300 ${
          isMenuOpen ? 'left-0 w-64' : '-left-64 w-64'
        }`}
      >
        <nav className="p-4 h-full overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 text-center border-b-2 border-red-600 pb-2">
            {isMenuOpen && "Administración"}
          </h2>
          <ul className="flex flex-col gap-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FFF8F0] hover:text-red-600 transition-colors"
                >
                  {item.icon}
                  {isMenuOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          isMenuOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          <div className="bg-white rounded-xl border-2 border-black shadow-lg p-6 overflow-x-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}