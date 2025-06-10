import Image from "next/image";

export default function SectionMap() {
  return (
    <section id="section-map" className="w-full bg-pink-50 py-12 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-pink-700">
        ¿Dónde encontrarnos?
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mx-auto gap-10">
        {/* Info izquierda */}
        <div className="flex-1 flex flex-col gap-6 items-center md:items-start">
          <div className="flex items-center gap-4">
            <span className="bg-pink-200 p-3 rounded-full">
              <Image
                src="/globe.svg"
                alt="Dirección"
                width={28}
                height={28}
              />
            </span>
            <span className="text-lg text-gray-700">
              Av. Japón 123, Ciudad Manga
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-pink-200 p-3 rounded-full">
              <Image
                src="/window.svg"
                alt="Teléfono"
                width={28}
                height={28}
              />
            </span>
            <span className="text-lg text-gray-700">
              +54 11 1234-5678
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-pink-200 p-3 rounded-full">
              <Image
                src="/vercel.svg"
                alt="Correo"
                width={28}
                height={28}
              />
            </span>
            <span className="text-lg text-gray-700">
              contacto@manganiho.com
            </span>
          </div>
        </div>
        {/* Mapa derecha */}
        <div className="flex-1 flex justify-center w-full">
          <iframe
            title="Ubicación MangaNihon"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-58.3816%2C-34.6037%2C-58.3816%2C-34.6037&amp;layer=mapnik"
            className="w-full h-72 md:w-96 md:h-80 rounded-lg shadow-lg border-2 border-pink-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}