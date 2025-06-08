"use client"
import { useState } from "react"
import { } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { seriesSchema, SeriesSchema } from "@/schemas/seriesSchema";
import agregarNuevaSerie from "@/lib/supabase/services/series.client";
export default function Page() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<SeriesSchema>({
        resolver: zodResolver(seriesSchema),
        mode: "onBlur",
    });
    const onSubmit = async (data: SeriesSchema) => {
        setLoading(true);
        setSuccess(false);
        await agregarNuevaSerie(data);
        setLoading(false);
        setSuccess(true);
        reset();
    }

    return (
        <>
            <main className="h-screen flex flex-col items-center justify-center pt-16 p-4 bg-gray-100">
                <h1 className="text-3xl font-bold mb-8">Admin Series</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white shadow-lg text-black rounded-lg p-8 w-full max-w-md space-y-6"
                >
                    <div>
                        <label htmlFor="nombre" className="block font-semibold mb-1">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            {...register('nombre')}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.nombre && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
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
                        <label htmlFor="estado" className="block font-semibold mb-1">Estado:</label>
                        <select
                            id="estado"
                            {...register('estado')}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="en_curso">En curso</option>
                            <option value="pausado">Pausado</option>
                            <option value="finalizada">Finalizada</option>
                        </select>
                        {errors.estado && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
                    </div>
                    <div>
                        <label htmlFor="imagen_url" className="block font-semibold mb-1">Imagen URL:</label>
                        <input
                            type="text"
                            id="imagen_url"
                            {...register('imagen_serie')}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.imagen_serie && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                Guardando...
                            </span>
                        ) : (
                            "Crear Serie"
                        )}
                    </button>
                    {success && (
                        <div className="text-green-600 text-center font-semibold mt-2">
                            ¡Serie agregada satisfactoriamente!
                        </div>
                    )}
                </form>
            </main>
        </>
    )
}