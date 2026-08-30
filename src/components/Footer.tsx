// Footer.tsx
import Link from "next/link";

const socialLinks = ['facebook', 'twitter', 'instagram', 'youtube'];
const quickLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/mangas', label: 'Mangas' },
  { href: '/novedades', label: 'Novedades' },
  { href: '/ofertas', label: 'Ofertas' }
];
const infoLinks = [
  { href: '#about', label: 'Sobre Nosotros' },
  { href: '#location', label: 'Encuéntranos' },
  { href: '/faq', label: 'Preguntas Frecuentes' },
  { href: '/terminos', label: 'Términos y Condiciones' }
];
const footerLinks = [
  { href: '/politica-privacidad', label: 'Política de Privacidad' },
  { href: '/terminos', label: 'Términos y Condiciones' },
  { href: '/admin/mangas', label: 'Admin' }
];

export default function Footer() {
  return (
    <footer className="w-full bg-ink text-cream pt-16 pb-8 border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="flex flex-col">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-white">MangaNihon</span>
              <span className="w-2 h-2 bg-primary rounded-full mx-2"></span>
              <span className="text-sm text-cream/80">© 2024</span>
            </div>
            <p className="text-cream/80 mb-6 leading-relaxed">
              Tu destino para los mejores mangas importados directamente de Japón.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social}
                  href="#"
                  className="bg-cream/10 hover:bg-primary text-cream w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <div className="w-5 h-5 bg-current rounded-full"></div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-cream/20">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/80 hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-cream/20">Información</h3>
            <ul className="space-y-4">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/80 hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-cream/20">Contacto</h3>
            <ul className="space-y-4 text-cream/80">
              <li className="flex items-start">
                <span className="mr-3 text-primary-light">📍</span>
                <span>Av. Japón 123, Ciudad Manga</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary-light">📞</span>
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary-light">✉️</span>
                <span>contacto@manganiho.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/20 my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-cream/60 text-sm mb-4 md:mb-0">
            © 2024 MangaNihon.
          </div>
          <div className="flex space-x-6">
            {footerLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-cream/60 hover:text-primary-light text-sm transition-colors"
                >
                    {link.label}
                </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}