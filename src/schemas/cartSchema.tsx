import { z } from "zod";

export const cartSchema = z.object({
    user_id: z.string(),
    manga_id: z.string(),
    cantidad: z.number(),
})

export type CartSchema = z.infer<typeof cartSchema>