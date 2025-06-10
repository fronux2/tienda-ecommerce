// schemas/mangaSchema.ts
import { z } from "zod"

export const nuevoMangaSchema = z.object({
  titulo: z.string().min(1),
  autor: z.string().min(1),
  editorial: z.string().min(1),
  categoria_id: z.string().uuid(),
  serie_id: z.string().uuid(),
  volumen: z.number().int().nonnegative(),
  descripcion: z.string().min(1),
  precio: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  imagen_portada: z.string().optional(),
  isbn: z.string().min(10), // puedes afinar esta validación si es necesario
  numero_paginas: z.number().int().positive(),
  idioma: z.string().min(1),
  fecha_publicacion: z.string(), // considera usar z.coerce.date() si manejas fechas reales
  estado: z.string().min(1),
  activo: z.boolean(),
  fecha_creacion: z.string().optional(), // igual que arriba, podrías usar fecha si es una real
})

// Tipo TypeScript inferido desde el esquema
export type NuevoManga = z.infer<typeof nuevoMangaSchema>
