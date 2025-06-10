import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#FFF7ED] flex flex-col md:flex-row justify-between items-center px-8 md:px-32 py-16">
      <div className="flex-1 flex flex-col items-start">
        <h2 className="text-4xl font-bold text-black mb-1">Bienvenido a</h2>
        <h1 className="text-5xl font-bold text-red-500 mb-4">MangaNihon</h1>
        <p className="text-2xl text-black mb-8">
          Descubre los mangas más populares y las últimas novedades traídas desde Japón. ¡Sumérgete en historias épicas y lleva tu pasión al siguiente nivel!
        </p>
        <Link
          href="#"
          className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-red-600 transition"
        >
          Ver Coleccion
        </Link>
      </div>
      <div className="flex-1 flex justify-center mt-10 md:mt-0">
        <Image
         src="/imagenes/librero.webp"
         alt="Librero"
         width={300}
         height={400}
         className="w-auto h-72 object-contain rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}