import { z } from "zod";

export const pedidosSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  fecha: z.string(),
  total: z.number(),
});