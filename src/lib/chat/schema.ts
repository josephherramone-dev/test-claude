import "server-only";
import { z } from "zod";

/** Server-side validation of /api/chat requests. */
export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .max(10)
    .optional()
    .default([]),
});
