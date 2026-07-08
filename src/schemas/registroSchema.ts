import { z } from "zod"

export const registroSchema = z
  .object({
    email: z.string().email("Ingresa un email válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmar_password: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmar_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar_password"],
  })

export type RegistroSchema = z.infer<typeof registroSchema>
