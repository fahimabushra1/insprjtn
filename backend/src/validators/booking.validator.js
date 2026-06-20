import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    packageId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid package ID format"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid departure date"),
    guests: z.number().int().min(1, "Must have at least 1 guest"),
    notes: z.string().max(1000).optional().default(""),
  }),
});

export const updateBookingStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID format"),
  }),
  body: z.object({
    status: z.enum(["pending", "confirmed", "cancelled"]),
  }),
});
