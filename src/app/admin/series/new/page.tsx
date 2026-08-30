"use client"
import { useState, useEffect } from "react"
import LoadingButton from '@/components/LoadingButton'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { seriesSchema, SeriesSchema } from "@/schemas/seriesSchema";
import agregarNuevaSerie from "@/lib/supabase/services/series.client";
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
export default function Page() {
    const router = useRouter()
    const [checking, setChecking] = useState(true)
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

    useEffect(() => {
      const checkRole = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }

        const { data: perfil } = await supabase
          .from('usuarios')
          .select('rol_id')
          .eq('id', user.id)
          .single()

        if (!perfil || perfil.rol_id! < 2) {
          router.push('/login')
        } else {
          setChecking(false)
        }
      }
      checkRole()
    }, [router])

    if (checking) return null

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
            <main className="h-screen flex flex-col items-center justify-center pt-16 p-4 bg-surface-alt">
                <h1 className="text-3xl font-bold mb-8">Admin Series</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-surface shadow-lg text-ink rounded-lg p-8 w-full max-w-md space-y-6"
                >
                    <div>
                        <label htmlFor="nombre" className="block font-semibold mb-1">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            {...register('nombre')}
                            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {errors.nombre && <span className="text-danger text-sm">Este campo es obligatorio</span>}
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="block font-semibold mb-1">Descripción:</label>
                        <textarea
                            id="descripcion"
                            {...register('descripcion')}
                            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {errors.descripcion && <span className="text-danger text-sm">Este campo es obligatorio</span>}
                    </div>
                    <div>
                        <label htmlFor="autor" className="block font-semibold mb-1">Autor:</label>
                        <input
                            type="text"
                            id="autor"
                            {...register('autor')}
                            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {errors.autor && <span className="text-danger text-sm">Este campo es obligatorio</span>}
                    </div>
                    <div>
                        <label htmlFor="estado" className="block font-semibold mb-1">Estado:</label>
                        <select
                            id="estado"
                            {...register('estado')}
                            className="w-full border border-border rounded px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="en_curso">En curso</option>
                            <option value="pausado">Pausado</option>
                            <option value="finalizada">Finalizada</option>
                        </select>
                        {errors.estado && <span className="text-danger text-sm">Este campo es obligatorio</span>}
                    </div>
                    <div>
                        <label htmlFor="imagen_url" className="block font-semibold mb-1">Imagen URL:</label>
                        <input
                            type="text"
                            id="imagen_url"
                            {...register('imagen_serie')}
                            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {errors.imagen_serie && <span className="text-danger text-sm">Este campo es obligatorio</span>}
                    </div>
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        variant="primary"
                        size="lg"
                        className="w-full"
                    >
                        Crear Serie
                    </LoadingButton>
                    {success && (
                        <div className="text-success text-center font-semibold mt-2">
                            ¡Serie agregada satisfactoriamente!
                        </div>
                    )}
                </form>
            </main>
        </>
    )
}