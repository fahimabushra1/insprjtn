import { Booking } from "../models/Booking.model.js";
import { Package } from "../models/Package.model.js";
import { ApiError } from "../utils/ApiError.js";

export const bookingService = {
  createBooking: async (userId, bookingData) => {
    const { packageId, startDate, guests, notes } = bookingData;

    // Find the package to calculate the price
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      throw new ApiError(404, "Package not found");
    }

    const totalPrice = pkg.price * guests;

    const booking = new Booking({
      userId,
      packageId,
      startDate: new Date(startDate),
      guests,
      totalPrice,
      notes,
    });

    await booking.save();
    return booking;
  },

  getBookings: async (filter = {}, options = {}) => {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;

    const query = Booking.find(filter)
      .populate("packageId", "title duration price location images slug")
      .populate("paymentId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);
    const bookings = await query.exec();

    return {
      bookings,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalBookings: total,
    };
  },

  getBookingById: async (id) => {
    const booking = await Booking.findById(id)
      .populate("packageId", "title duration price location images slug included excluded itinerary")
      .populate("paymentId")
      .populate("userId", "name email phone");
      
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }
    return booking;
  },

  cancelBooking: async (bookingId, userId, isAdmin = false) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    // Check ownership if not admin
    if (!isAdmin && booking.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "You do not have permission to cancel this booking");
    }

    // Can only cancel if booking is pending and payment is pending
    if (booking.bookingStatus !== "pending") {
      throw new ApiError(400, `Cannot cancel booking with status: ${booking.bookingStatus}`);
    }

    booking.bookingStatus = "cancelled";
    await booking.save();
    return booking;
  },

  updateBookingStatus: async (bookingId, status) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    booking.bookingStatus = status;
    await booking.save();
    return booking;
  },
};
