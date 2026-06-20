import { bookingService } from "../services/booking.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const createBooking = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const booking = await bookingService.createBooking(userId, req.validated.body);
  res.status(201).json(new ApiResponse(201, booking, "Booking created successfully"));
});

export const getBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin";

  const filter = isAdmin ? {} : { userId };
  const { page, limit } = req.query; // Fallback or basic page limit

  const data = await bookingService.getBookings(filter, { page, limit });
  res.status(200).json(new ApiResponse(200, data, "Bookings retrieved successfully"));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin";

  const booking = await bookingService.getBookingById(id);

  if (!isAdmin && booking.userId._id.toString() !== userId.toString()) {
    throw new ApiError(403, "You do not have permission to view this booking");
  }

  res.status(200).json(new ApiResponse(200, booking, "Booking retrieved successfully"));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin";

  const booking = await bookingService.cancelBooking(id, userId, isAdmin);
  res.status(200).json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.validated.body;

  const booking = await bookingService.updateBookingStatus(id, status);
  res.status(200).json(new ApiResponse(200, booking, `Booking status updated to ${status}`));
});
