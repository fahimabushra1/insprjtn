import mongoose from "mongoose";

const tourAvailabilitySchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["available", "limited", "full", "closed"],
      default: "available",
      required: true,
    },
    remainingSeats: {
      type: Number,
      default: 50,
    },
    reason: {
      type: String,
      default: "", // reason for fully booked or closed (e.g. "Forest department closure notice")
    },
  },
  { timestamps: true }
);

export const TourAvailability =
  (mongoose.models.TourAvailability || mongoose.model("TourAvailability", tourAvailabilitySchema)) as any;
