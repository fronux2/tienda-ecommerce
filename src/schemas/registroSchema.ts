import { z } from "zod"

// Simbolos aceptados por Supabase Auth:
// !@#$%^&*()_+-=[]{};'\:"|<>?,./`~
const SIMBOLOS = /[!@#$%^&*()_+\-=\[\]{};'\\:"|<>?,.\/`~]/

export const registroSchema = z
  .object({
    email: z.string().email("Ingresa un email válido"),
    password: z
      .string()
      .min(10, "La contraseña debe tener al menos 10 caracteres")
      .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
      .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número")
      .regex(SIMBOLOS, "Debe incluir al menos un símbolo (por ejemplo !@#$%)"),
    confirmar_password: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmar_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar_password"],
  })

export type RegistroSchema = z.infer<typeof registroSchema>
