// Hero.tsx
import Link from "next/link";
import Image from "next/image";
import Librero from '../../public/imagenes/librero.webp';
export default function Hero() {
  return (
    <section className="bg-[#FFF8F0] border-b-2 border-red-600 py-12 px-6 md:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold text-black">Bienvenido a</h2>
          <h1 className="text-5xl md:text-6xl font-bold text-red-600">MangaNihon</h1>
          <p className="text-xl text-gray-800 leading-relaxed">
            Descubre los mangas más populares y las últimas novedades traídas desde Japón. 
            ¡Sumérgete en historias épicas y lleva tu pasión al siguiente nivel!
          </p>
          <Link
            href="#popular"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition-colors duration-300"
          >
            Ver Colección
          </Link>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <Image
            src={Librero}
            alt="Librero de mangas"
            width={500}
            height={500}
            className="w-full max-w-md h-auto object-contain rounded-lg shadow-xl"
            placeholder="blur"
            priority
          />
        </div>
      </div>
    </section>
  );
}