import { paymentService } from "../services/payment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitPayment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const payment = await paymentService.submitPayment(userId, req.validated.body);
  res.status(201).json(new ApiResponse(201, payment, "Payment transaction submitted successfully for verification"));
});

export const getPayments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin";

  const filter = isAdmin ? {} : { userId };
  const { page, limit } = req.query;

  const data = await paymentService.getPayments(filter, { page, limit });
  res.status(200).json(new ApiResponse(200, data, "Payments retrieved successfully"));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payment = await paymentService.verifyPayment(id);
  res.status(200).json(new ApiResponse(200, payment, "Payment verified and booking confirmed successfully"));
});
