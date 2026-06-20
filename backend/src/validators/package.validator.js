import { z } from "zod";

const itineraryItemSchema = z.object({
  day: z.number().int().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
});

export const createPackageSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10),
    duration: z.string().min(1).max(100),
    price: z.number().min(0),
    location: z.string().min(1).max(200),
    images: z.array(z.string().url()).min(1),
    featured: z.boolean().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    itinerary: z.array(itineraryItemSchema).optional(),
  }),
});

export const updatePackageSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).optional(),
    duration: z.string().min(1).max(100).optional(),
    price: z.number().min(0).optional(),
    location: z.string().min(1).max(200).optional(),
    images: z.array(z.string().url()).min(1).optional(),
    featured: z.boolean().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    itinerary: z.array(itineraryItemSchema).optional(),
  }),
});

export const packageSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});

export const packageIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const packageListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
    featured: z.enum(["true", "false"]).optional(),
    search: z.string().optional(),
    sort: z.string().optional().default("-createdAt"),
  }),
});
