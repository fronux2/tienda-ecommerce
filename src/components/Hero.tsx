// Hero.tsx
import Link from "next/link";
import Image from "next/image";
import Librero from '../../public/imagenes/librero.webp';
export default function Hero() {
  return (
    <section className="bg-cream py-12 px-6 md:px-24 relative">
      {/* Franja tipo "obi" — la faja de papel que envuelve los tomos japoneses */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        <div className="md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <span className="w-2 h-2 bg-primary" />
            Importado directo de Japón
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight">
            <span className="block text-ink">Manga</span>
            <span className="block text-primary">Nihon</span>
          </h1>
          <p className="text-xl text-text leading-relaxed max-w-md">
            Descubre los mangas más populares y las últimas novedades traídas desde Japón.
            ¡Sumérgete en historias épicas y lleva tu pasión al siguiente nivel!
          </p>
          <Link
            href="#popular"
            className="inline-block bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
          >
            Ver Colección
          </Link>
        </div>

        <div className="md:w-1/2 flex justify-center relative">
          <Image
            src={Librero}
            alt="Librero de mangas"
            width={500}
            height={500}
            className="w-full max-w-md h-auto object-contain rounded-lg shadow-xl"
            placeholder="blur"
            priority
          />
          {/* Sello estilo hanko — guiño al "sello hinomaru" de la marca */}
          <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg border-4 border-cream rotate-[-8deg]">
            MN
          </div>
        </div>
      </div>
    </section>
  );
}