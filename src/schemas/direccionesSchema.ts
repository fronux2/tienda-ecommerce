import {z} from "zod";

export const direccionSchema = z.object({
  nombre_direccion: z.string().min(1, 'El nombre es obligatorio'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  numero_casa: z.string().min(1, 'El número de casa es obligatorio'),
  ciudad: z.string().min(1, 'La ciudad es obligatoria'),
  codigo_postal: z.string().optional(),
});

export type DireccionSchema = z.infer<typeof direccionSchema>
