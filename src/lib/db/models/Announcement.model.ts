import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    endDate: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export const Announcement =
  (mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema)) as any;
