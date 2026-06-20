import { Payment } from "../models/Payment.model.js";
import { Booking } from "../models/Booking.model.js";
import { ApiError } from "../utils/ApiError.js";

export const paymentService = {
  submitPayment: async (userId, paymentData) => {
    const { bookingId, paymentMethod, transactionId } = paymentData;

    // Check if the booking exists and belongs to the user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, "Booking not found");
    }

    if (booking.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "You do not own this booking");
    }

    // Check if the booking is already paid or cancelled
    if (booking.paymentStatus === "paid") {
      throw new ApiError(400, "This booking has already been paid");
    }

    if (booking.bookingStatus === "cancelled") {
      throw new ApiError(400, "Cannot submit payment for a cancelled booking");
    }

    // Check if transaction ID is unique
    const existingTx = await Payment.findOne({ transactionId });
    if (existingTx) {
      throw new ApiError(400, "Transaction ID has already been used");
    }

    // Create the payment record
    const payment = new Payment({
      userId,
      bookingId,
      amount: booking.totalPrice,
      paymentMethod,
      transactionId,
      paymentStatus: "pending",
      verifiedByAdmin: false,
    });

    await payment.save();

    // Link payment to the booking
    booking.paymentId = payment._id;
    booking.paymentStatus = "pending";
    await booking.save();

    return payment;
  },

  getPayments: async (filter = {}, options = {}) => {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;

    const query = Payment.find(filter)
      .populate("bookingId")
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(filter);
    const payments = await query.exec();

    return {
      payments,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalPayments: total,
    };
  },

  verifyPayment: async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new ApiError(404, "Payment record not found");
    }

    if (payment.paymentStatus === "paid") {
      throw new ApiError(400, "Payment is already marked as paid");
    }

    // Update payment record
    payment.paymentStatus = "paid";
    payment.verifiedByAdmin = true;
    payment.paidAt = new Date();
    await payment.save();

    // Update associated booking
    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.paymentStatus = "paid";
      booking.bookingStatus = "confirmed";
      await booking.save();
    }

    return payment;
  },
};
