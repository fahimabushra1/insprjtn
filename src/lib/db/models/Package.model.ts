import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length >= 1,
        message: "At least one image is required",
      },
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    itinerary: {
      type: [itineraryItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Package = (mongoose.models.Package || mongoose.model("Package", packageSchema)) as any;

