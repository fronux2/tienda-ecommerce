import { getMangas } from "@/lib/supabase/services/mangas";

export default async function Page() {
  const mangas = await getMangas();
  console.log("Mangas:", mangas);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2 text-gray-700">Lista de Mangas</p>

      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow">
        <table className="min-w-[1000px] w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Título</th>
              <th className="px-4 py-2 border">Autor</th>
              <th className="px-4 py-2 border">Editorial</th>
              <th className="px-4 py-2 border">Categoría</th>
              <th className="px-4 py-2 border">Serie</th>
              <th className="px-4 py-2 border">Volumen</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Precio</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Portada</th>
              <th className="px-4 py-2 border">ISBN</th>
              <th className="px-4 py-2 border">Páginas</th>
              <th className="px-4 py-2 border">Idioma</th>
              <th className="px-4 py-2 border">Publicación</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Activo</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {mangas.map((manga) => (
              <tr key={manga.id} className="">
                <td className="px-4 py-2 border">{manga.titulo}</td>
                <td className="px-4 py-2 border">{manga.autor}</td>
                <td className="px-4 py-2 border">{manga.editorial}</td>
                <td className="px-4 py-2 border">{manga.categoria_id}</td>
                <td className="px-4 py-2 border">{manga.serie_id}</td>
                <td className="px-4 py-2 border">{manga.volumen}</td>
                <td className="px-4 py-2 border">{manga.descripcion}</td>
                <td className="px-4 py-2 border">${manga.precio}</td>
                <td className="px-4 py-2 border">{manga.stock}</td>
                
                <td className="px-4 py-2 border">{manga.isbn}</td>
                <td className="px-4 py-2 border">{manga.numero_paginas}</td>
                <td className="px-4 py-2 border">{manga.idioma}</td>
                <td className="px-4 py-2 border">{manga.fecha_publicacion}</td>
                <td className="px-4 py-2 border">{manga.estado}</td>
                <td className="px-4 py-2 border">{manga.activo ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
