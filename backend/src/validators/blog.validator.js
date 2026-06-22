import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    content: z.string().min(10),
    thumbnail: z.string().url("Thumbnail must be a valid URL"),
    author: z.string().min(2).max(100),
  }),
});

export const updateBlogSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    content: z.string().min(10).optional(),
    thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
    author: z.string().min(2).max(100).optional(),
  }),
});

export const blogSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});

export const blogIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const blogListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
    search: z.string().optional(),
    sort: z.string().optional().default("-createdAt"),
  }),
});
