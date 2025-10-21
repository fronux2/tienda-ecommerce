"use client";
import { nuevoMangaSchema, NuevoManga } from "@/schemas/mangasSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getCategoriasClient } from "@/lib/supabase/services/categorias.client";
import { getSeriesClient } from "@/lib/supabase/services/series.client";
import { useEffect, useState } from "react";
import { type Categoria, type Serie } from "@/types/supabase";
import { crearManga } from "@/lib/supabase/services/mangas.client";
import { createClient } from "@/utils/supabase/client";

export default function CrearMangaForm() {
  const supabase = createClient();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // --- MEJORA: Añadir estados de carga y error para una mejor UX ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- CORRECCIÓN: Se elimina el estado 'url' ya que no se utilizaba ---
  // const [url, setUrl] = useState("");

  const { register, reset, handleSubmit, formState: { errors } } = useForm<NuevoManga>({
    resolver: zodResolver(nuevoMangaSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // No es necesario forzar el tipo con 'as' si las funciones devuelven el tipo correcto
        const categoriasData = await getCategoriasClient();
        const seriesData = await getSeriesClient();
        if (categoriasData) setCategorias(categoriasData);
        if (seriesData) setSeries(seriesData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setFormError("No se pudieron cargar las categorías y series.");
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: NuevoManga) => {
    if (!file) {
      setFormError("Por favor, selecciona una imagen para la portada.");
      return;
    }
    
    // --- MEJORA: Iniciar estado de carga y limpiar errores previos ---
    setIsSubmitting(true);
    setFormError(null);

    try {
      const filePath = `${Date.now()}-${file.name}`; // Añadir timestamp para evitar sobreescrituras

      const { error: uploadError } = await supabase.storage
        .from("mangas")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false, // Usar false para evitar sobreescribir archivos con el mismo nombre
        });

      if (uploadError) {
        // Lanzar el error para que sea capturado por el bloque catch
        throw new Error(`Error al subir la imagen: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("mangas")
        .getPublicUrl(filePath);
      
      // La URL se usa directamente, no es necesario guardarla en un estado
      const imageUrl = publicUrlData.publicUrl;

      const nuevoManga = { ...data, imagen_portada: imageUrl };
      await crearManga(nuevoManga);
      
      alert("¡Manga creado con éxito!"); // O usar un componente de notificación (toast)
      reset();
      setFile(null);
      // Limpiar el input de archivo visualmente
      const fileInput = document.getElementById('imagen_portada') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: unknown) {
      console.error("Error en el proceso de creación:", error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Ocurrió un error inesperado al crear el manga.";
      setFormError(message);
    } finally {
      // --- MEJORA: Detener el estado de carga siempre, incluso si hay un error ---
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 bg-white">
      {/* --- MEJORA: Mostrar error general del formulario --- */}
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      {/* ... (el resto de tus inputs no cambia) ... */}
       <div>
         <label htmlFor="titulo" className="block font-semibold mb-1">Nombre:</label>
         <input 
           type="text" 
           id="titulo" 
           {...register('titulo')} 
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.titulo && <span className="text-red-500 text-sm">{errors.titulo.message}</span>}
       </div>
       <div>
         <label htmlFor="autor" className="block font-semibold mb-1">Autor:</label>
         <input 
           type="text" 
           id="autor" 
           {...register('autor')} 
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.autor && <span className="text-red-500 text-sm">{errors.autor.message}</span>}
       </div>
       <div>
         <label htmlFor="editorial" className="block font-semibold mb-1">Editorial:</label>
         <input
           type="text" 
           id="editorial" 
           {...register('editorial')} 
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.editorial && <span className="text-red-500 text-sm">{errors.editorial.message}</span>}
       </div>      
       <div>
         <label htmlFor="categoria_id" className="block font-semibold mb-1">Categoría:</label>
         <select 
           className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400" 
           id="categoria_id" 
           {...register('categoria_id')}
         >
          <option value="">Selecciona una categoría</option>
           {categorias.map((categoria) => (
             <option key={categoria.id} value={categoria.id}>
               {categoria.nombre}
             </option>
           ))}
         </select>
         {errors.categoria_id && <span className="text-red-500 text-sm">{errors.categoria_id.message}</span>}
       </div>
       <div>
         <label htmlFor="serie_id" className="block font-semibold mb-1">Serie:</label>
         <select 
           id="serie_id" 
           {...register('serie_id')}
           className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
         >
           <option value="">Selecciona una serie</option>
           {series.map((serie) => (
             <option key={serie.id} value={serie.id}>
               {serie.nombre}
             </option>
           ))}
         </select>
         {errors.serie_id && <span className="text-red-500 text-sm">{errors.serie_id.message}</span>}
       </div>
       <div>
         <label htmlFor="volumen" className="block font-semibold mb-1">Volumen:</label>
         <input 
           type="number" 
           id="volumen" 
           {...register('volumen' , { valueAsNumber: true })} 
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.volumen && <span className="text-red-500 text-sm">{errors.volumen.message}</span>}
       </div>
       <div>
         <label htmlFor="descripcion" className="block font-semibold mb-1">Descripción:</label>
         <textarea 
           id="descripcion" 
           {...register('descripcion')} 
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion.message}</span>}
       </div>
       <div>
         <label htmlFor="precio" className="block font-semibold mb-1">Precio:</label>
         <input 
           type="number" 
           id="precio" 
           step="0.01"
           {...register('precio', { valueAsNumber: true })} 
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.precio && <span className="text-red-500 text-sm">{errors.precio.message}</span>}
       </div>
       <div>
         <label htmlFor="stock" className="block font-semibold mb-1">Stock:</label>
         <input
           type="number"
           id="stock"
           {...register('stock', { valueAsNumber: true })}
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.stock && <span className="text-red-500 text-sm">{errors.stock.message}</span>}
       </div>
       <div>
         <label htmlFor="imagen_portada" className="block font-semibold mb-1">Imagen Portada:</label>
         <input
           type="file"
           id="imagen_portada"           
           accept="image/png, image/jpeg, image/webp"
           onChange={(e) => setFile(e.target.files?.[0] || null)}
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
       </div>
       <div>
         <label htmlFor="isbn" className="block font-semibold mb-1">ISBN:</label>
         <input
           type="text"
           id="isbn"
           {...register('isbn')}
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.isbn && <span className="text-red-500 text-sm">{errors.isbn.message}</span>}
       </div>
       <div>
         <label htmlFor="numero_paginas" className="block font-semibold mb-1">Número de páginas:</label>
         <input
           type="number"
           id="numero_paginas"
           {...register('numero_paginas', { valueAsNumber: true })}
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.numero_paginas && <span className="text-red-500 text-sm">{errors.numero_paginas.message}</span>}
       </div>
       <div>
         <label htmlFor="idioma" className="block font-semibold mb-1">Idioma:</label>
         <input
           type="text"
           id="idioma"
           {...register('idioma')}
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.idioma && <span className="text-red-500 text-sm">{errors.idioma.message}</span>}
       </div>
       <div>
         <label htmlFor="fecha_publicacion" className="block font-semibold mb-1">Fecha de publicación:</label>
         <input
           type="date"
           id="fecha_publicacion"
           {...register('fecha_publicacion')}
           className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
         />
         {errors.fecha_publicacion && <span className="text-red-500 text-sm">{errors.fecha_publicacion.message}</span>}
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
           <option value="edicion_limitada">Edición limitada</option>
         </select>
         {errors.estado && <span className="text-red-500 text-sm">{errors.estado.message}</span>}
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
       <div>
           <label htmlFor="es_popular" className="block font-semibold mb-1">Es popular (opcional):</label>
           <select
             id="es_popular"
             {...register('es_popular')}
             className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
           >
             <option value="">No especificar</option>
             <option value="true">Sí</option>
             <option value="false">No</option>
           </select>
           {errors.es_popular && <span className="text-red-500 text-sm">{errors.es_popular.message}</span>}
       </div> 
      <button
        type="submit"
        disabled={isSubmitting} // --- MEJORA: Deshabilitar botón mientras se envía
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-400"
      >
        {isSubmitting ? 'Creando...' : 'Crear'} 
      </button>
    </form>
  );
}
