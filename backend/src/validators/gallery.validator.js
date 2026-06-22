import { z } from "zod";

export const createGallerySchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    image: z.string().url("Image must be a valid URL"),
  }),
});

export const galleryIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const galleryListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(24),
    sort: z.string().optional().default("-createdAt"),
  }),
});
