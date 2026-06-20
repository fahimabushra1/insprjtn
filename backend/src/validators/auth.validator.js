import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    phone: z.string().max(20).optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().max(20).optional(),
    address: z.string().max(500).optional(),
    photo: z.string().url().optional().or(z.literal("")),
  }),
});
