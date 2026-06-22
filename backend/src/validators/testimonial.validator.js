import { z } from "zod";

export const createTestimonialSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    designation: z.string().min(2).max(100),
    photo: z.string().url("Photo must be a valid URL").optional().or(z.literal("")),
    review: z.string().min(5).max(1000),
    rating: z.coerce.number().int().min(1).max(5),
  }),
});

export const updateTestimonialSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    designation: z.string().min(2).max(100).optional(),
    photo: z.string().url("Photo must be a valid URL").optional().or(z.literal("")),
    review: z.string().min(5).max(1000).optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
  }),
});

export const testimonialIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const testimonialListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
    sort: z.string().optional().default("-createdAt"),
  }),
});
