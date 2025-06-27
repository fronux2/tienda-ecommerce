import Link from "next/link";
import Image from "next/image";
import librero from '../../public/imagenes/librero.webp'

export default function Hero() {
  return (
    <section className="bg-[#FFF8F0] border-b-2 border-red-600 py-12 px-6 md:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        {/* Texto - Orden cambiado para prioridad móvil */}
        <div className="md:w-1/2 space-y-6 order-2 md:order-1">
          <h2 className="text-4xl font-bold text-black">Bienvenido a</h2>
          <h1 className="text-5xl md:text-6xl font-bold text-red-600">MangaNihon</h1>
          <p className="text-xl text-gray-800 leading-relaxed">
            Descubre los mangas más populares y las últimas novedades traídas desde Japón. ¡Sumérgete en historias épicas y lleva tu pasión al siguiente nivel!
          </p>
          <Link
            href="/mangas"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition-colors duration-300"
            prefetch={false} // Desactiva prefetch para ahorrar ancho de banda inicial
          >
            Ver Colección
          </Link>
        </div>

        {/* Imagen con optimizaciones avanzadas */}
        <div className="md:w-1/2 flex justify-center order-1 md:order-2">
          <Image
            src={librero}
            alt="Librero de mangas"
            width={500}
            height={500}
            priority
            quality={85} 
            className="w-full max-w-md h-auto object-contain rounded-lg shadow-xl"
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur" 
          />
        </div>
      </div>
    </section>
  );
}