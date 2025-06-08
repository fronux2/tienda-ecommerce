import { z } from "zod"
export const nuevoUsuarioSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type NuevoUsuarioSchema = z.infer<typeof nuevoUsuarioSchema>