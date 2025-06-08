import {z} from "zod";

export const seriesSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  autor: z.string().min(1, 'El autor es obligatorio'),
  estado: z.string().min(1, 'El estado es obligatorio'),
  imagen_serie: z.string().url('Debe ser una URL válida'),
});

export type SeriesSchema = z.infer<typeof seriesSchema>