// Invitation.tsx
import Link from 'next/link';

export default function Invitation() {
  return (
    <section className="w-full bg-linear-to-r from-cream to-[#FFF0E0] py-20 border-t-2 border-primary relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-ink mb-6">
          ¿Listo para tu próxima <span className="text-primary">aventura</span>?
        </h2>

        <div className="flex justify-center mb-8">
          <div className="h-1 w-20 bg-primary rounded-full"></div>
        </div>

        <p className="text-xl text-text mb-10 max-w-2xl mx-auto leading-relaxed">
          Ven a MangaNihon y encuentra tu nuevo manga favorito. ¡Nuevos títulos cada semana!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/mangas"
            className="bg-primary hover:bg-primary-hover text-white font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Ver Mangas Populares
          </Link>

          <Link
            href="/novedades"
            className="bg-surface border-2 border-primary text-primary hover:bg-red-50 font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Ver Novedades
          </Link>
        </div>
      </div>
    </section>
  );
}