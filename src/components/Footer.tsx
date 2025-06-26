import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-[#FFF8F0] pt-16 pb-8 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Columna 1: Logo e información */}
          <div className="flex flex-col">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-white">MangaNihon</span>
              <span className="w-2 h-2 bg-red-600 rounded-full mx-2"></span>
              <span className="text-sm text-[#FFF8F0]/80">© 2024</span>
            </div>
            <p className="text-[#FFF8F0]/80 mb-6 leading-relaxed">
              Tu destino para los mejores mangas importados directamente de Japón. Calidad, autenticidad y pasión por la cultura manga.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="bg-[#FFF8F0]/10 hover:bg-red-600 text-[#FFF8F0] w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <div className="w-5 h-5 bg-current rounded-full"></div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-[#FFF8F0]/20">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/mangas', label: 'Mangas' },
                { href: '/novedades', label: 'Novedades' },
                { href: '/ofertas', label: 'Ofertas' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-[#FFF8F0]/80 hover:text-red-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Columna 3: Información */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-[#FFF8F0]/20">Información</h3>
            <ul className="space-y-4">
              {[
                { href: '#about', label: 'Sobre Nosotros' },
                { href: '#section-map', label: 'Encuéntranos' },
                { href: '/faq', label: 'Preguntas Frecuentes' },
                { href: '/terminos', label: 'Términos y Condiciones' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-[#FFF8F0]/80 hover:text-red-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-[#FFF8F0]/20">Contacto</h3>
            <ul className="space-y-4 text-[#FFF8F0]/80">
              <li className="flex items-start">
                <span className="mr-3 text-red-500">📍</span>
                <span>Av. Japón 123, Ciudad Manga</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-500">📞</span>
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-500">✉️</span>
                <span>contacto@manganiho.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* División */}
        <div className="border-t border-[#FFF8F0]/20 my-8"></div>
        
        {/* Pie inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#FFF8F0]/60 text-sm mb-4 md:mb-0">
            © 2024 MangaNihon.
          </div>
          <div className="flex space-x-6">
            <Link href="/politica-privacidad" className="text-[#FFF8F0]/60 hover:text-red-500 text-sm transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-[#FFF8F0]/60 hover:text-red-500 text-sm transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/admin/mangas" className="text-[#FFF8F0]/60 hover:text-red-500 text-sm transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}