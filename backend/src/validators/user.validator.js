import { z } from "zod";

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    role: z.enum(["customer", "admin"]),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const userListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    search: z.string().optional(),
    sort: z.string().optional().default("-createdAt"),
  }),
});
