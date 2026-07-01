import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleBn: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    endDate: {
      type: String, // Format: YYYY-MM-DD
      default: "",
    },
    type: {
      type: String,
      required: true,
      enum: ["national", "religious", "festival", "weekend", "long-weekend"],
      default: "national",
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#e11d48", // Hex color representation
    },
  },
  { timestamps: true }
);

export const Holiday = (mongoose.models.Holiday || mongoose.model("Holiday", holidaySchema)) as any;
