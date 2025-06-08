'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearCategoria } from '../actions/categorias'

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
})

type FormData = z.infer<typeof schema>

export default function CrearCategoriaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await crearCategoria(data)
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='max-w-md mx-auto p-4 border rounded shadow space-y-4'
    >
      <h2 className='text-xl font-bold'>Crear Categoría</h2>

      <div>
        <label htmlFor='name' className='block mb-1'>
          Nombre:
        </label>
        <input
          id='name'
          {...register('name')}
          className='w-full border p-2 rounded'
        />
        {errors.name && (
          <p className='text-red-600 text-sm'>{errors.name.message}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
      >
        {isSubmitting ? 'Guardando...' : 'Crear Categoría'}
      </button>
    </form>
  )
}
