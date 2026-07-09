import {z} from "zod";

export const direccionSchema = z.object({
  nombre_direccion: z.string().min(1, 'El nombre es obligatorio'),
  calle: z.string().min(1, 'La calle es obligatoria'),
  numero: z.string().min(1, 'El número es obligatorio'),
  departamento: z.string().optional(),
  comuna: z.string().min(1, 'La comuna es obligatoria'),
  ciudad: z.string().min(1, 'La ciudad es obligatoria'),
  region: z.string().optional(),
  codigo_postal: z.string().optional(),
});

export type DireccionSchema = z.infer<typeof direccionSchema>
