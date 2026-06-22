import { z } from "zod";

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5).max(20),
    message: z.string().min(10).max(2000),
  }),
});

export const updateContactStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(["pending", "read", "resolved"]),
  }),
});

export const contactIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const contactListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
    status: z.enum(["pending", "read", "resolved"]).optional(),
    sort: z.string().optional().default("-createdAt"),
  }),
});
