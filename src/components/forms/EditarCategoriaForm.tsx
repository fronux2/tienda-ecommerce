'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// Esquema de validación con Zod
const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
})

type FormData = z.infer<typeof schema>

type EditarCategoriaFormProps = {
  categoria: {
    id: string
    name: string
  }
}

export default function EditarCategoriaForm({ categoria }: EditarCategoriaFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [mensaje, setMensaje] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: categoria.name,
    },
  })

  useEffect(() => {
    reset({ name: categoria.name })
  }, [categoria, reset])

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase
      .from('categorias')
      .update({ name: data.name })
      .eq('id', categoria.id)

    if (error) {
      setMensaje('Error al actualizar la categoría.')
      console.error(error)
    } else {
      setMensaje('Categoría actualizada correctamente.')
      router.refresh() // Actualiza datos
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md p-4 border rounded shadow">
      <h2 className="text-xl font-semibold">Editar Categoría</h2>

      <label htmlFor="name">Nombre:</label>
      <input
        id="name"
        {...register('name')}
        className="border p-2 rounded"
        placeholder="Nombre de la categoría"
      />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
      </button>

      {mensaje && <p className="text-sm text-center text-green-600">{mensaje}</p>}
    </form>
  )
}
