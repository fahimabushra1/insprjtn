import { z } from "zod";

export const submitPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID format"),
    paymentMethod: z.enum(["bkash", "nagad", "rocket", "bank"]),
    transactionId: z
      .string()
      .min(6, "Transaction ID is too short")
      .max(30, "Transaction ID is too long")
      .regex(/^[a-zA-Z0-9]+$/, "Transaction ID must be alphanumeric"),
  }),
});

export const paymentIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid payment ID format"),
  }),
});
