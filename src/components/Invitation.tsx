import React from 'react';

export default function Invitation() {
  return (
    <section className="flex flex-col items-center justify-center py-16 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-700 mb-4">
        ¿Listo para tu próxima aventura?
      </h2>
      <p className="text-lg md:text-xl text-center text-gray-700 mb-8 max-w-xl">
        Ven a MangaNihon y encuentra tu nuevo manga favorito. ¡Nuevos títulos cada semana!
      </p>
      <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition">
        Ver Mangas Populares
      </button>
    </section>
  );
}