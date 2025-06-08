"use client"
import { nuevoMangaSchema, NuevoManga } from "@/schemas/mangasSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { getCategoriasClient } from "@/lib/supabase/services/categorias.client";
import { getSeriesClient } from "@/lib/supabase/services/series.client";
import { useEffect,useState } from "react";
import { type Categoria, type Serie } from "@/types/supabase";
import { crearManga } from "@/lib/supabase/services/mangas.client";

export default function Page() {

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);

  const { register, reset, handleSubmit, formState: { errors } } = useForm<NuevoManga>({
    resolver: zodResolver(nuevoMangaSchema),
  });
 
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const categorias = await getCategoriasClient() as Categoria[];
        const series = await getSeriesClient() as Serie[];

        // Aquí puedes hacer algo con las categorías y series, como guardarlas en el estado
        console.log('Categorías:', categorias);
        console.log('Series:', series);
        if (categorias) {
          setCategorias(categorias);
        }
        if (series) {
          setSeries(series);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    }
    fetchData();
  }, []);

  const onSubmit = async (data: NuevoManga) => {
    console.log('Datos enviados:', data);
    // Aquí puedes hacer algo con los datos enviados, como crear el manga en la base de datos
    console.log('Categorias:', categorias);
    console.log('Series:', series);
    const nuevoManga = await crearManga(data);
    console.log('Nuevo manga creado:', nuevoManga);
    reset();

  }

  return(<>
  <main className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-8">Admin</h1>
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className=" shadow-lg rounded-lg p-8 w-full max-w-md space-y-6"
    >
      <div>
        <label htmlFor="titulo" className="block font-semibold mb-1">Nombre:</label>
        <input 
          type="text" 
          id="titulo" 
          {...register('titulo')} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.titulo && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="autor" className="block font-semibold mb-1">Autor:</label>
        <input 
          type="text" 
          id="autor" 
          {...register('autor')} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.autor && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="editorial" className="block font-semibold mb-1">Editorial:</label>
        <input
          type="text" 
          id="editorial" 
          {...register('editorial')} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>     
      <div>
        <label htmlFor="categoria_id" className="block font-semibold mb-1">Categoría:</label>
        <select 
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400" 
          id="categoria_id" 
          {...register('categoria_id')}
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        {errors.categoria_id && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="serie_id" className="block font-semibold mb-1">Serie:</label>
        <select 
          id="serie_id" 
          {...register('serie_id')}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {series.map((serie) => (
            <option key={serie.id} value={serie.id}>
              {serie.nombre}
            </option>
          ))}
        </select>
        {errors.serie_id && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="volumen" className="block font-semibold mb-1">Volumen:</label>
        <input 
          type="number" 
          id="volumen" 
          {...register('volumen' , { valueAsNumber: true })} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.volumen && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="descripcion" className="block font-semibold mb-1">Descripción:</label>
        <textarea 
          id="descripcion" 
          {...register('descripcion')} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.descripcion && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="precio" className="block font-semibold mb-1">Precio:</label>
        <input 
          type="number" 
          id="precio" 
          {...register('precio', { valueAsNumber: true })} 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.precio && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="stock" className="block font-semibold mb-1">Stock:</label>
        <input
          type="number"
          id="stock"
          {...register('stock', { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.stock && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="imagen_portada" className="block font-semibold mb-1">Imagen Portada (URL):</label>
        <input
          type="text"
          id="imagen_portada"
          {...register('imagen_portada')}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.imagen_portada && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="isbn" className="block font-semibold mb-1">ISBN:</label>
        <input
          type="text"
          id="isbn"
          {...register('isbn')}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.isbn && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="numero_paginas" className="block font-semibold mb-1">Número de páginas:</label>
        <input
          type="number"
          id="numero_paginas"
          {...register('numero_paginas', { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.numero_paginas && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="idioma" className="block font-semibold mb-1">Idioma:</label>
        <input
          type="text"
          id="idioma"
          {...register('idioma')}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.idioma && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="fecha_publicacion" className="block font-semibold mb-1">Fecha de publicación:</label>
        <input
          type="date"
          id="fecha_publicacion"
          {...register('fecha_publicacion')}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.fecha_publicacion && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div>
        <label htmlFor="estado" className="block font-semibold mb-1">Estado:</label>
        <select
          id="estado"
          {...register('estado')}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Selecciona un estado</option>
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
          <option value="edicion_limitada">Edicion limitada</option>
        </select>
        {errors.estado && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="activo"
          {...register('activo')}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
        />
        <label htmlFor="activo" className="font-semibold">Activo</label>
      </div>     

      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Crear
      </button>
    </form>
  </main>
  </>)
  }

