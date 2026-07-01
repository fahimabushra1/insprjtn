import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameBn: {
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
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["gateway", "spot"],
      required: true,
      default: "spot",
    },
    description: {
      type: String,
      required: true,
    },
    history: {
      type: String,
      default: "",
    },
    featuredImage: {
      type: String,
      default: "",
    },
    gallery: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    wildlife: {
      tiger: { type: Number, min: 0, max: 5, default: 0 },
      deer: { type: Number, min: 0, max: 5, default: 0 },
      crocodile: { type: Number, min: 0, max: 5, default: 0 },
      dolphin: { type: Number, min: 0, max: 5, default: 0 },
      birds: { type: Number, min: 0, max: 5, default: 0 },
      reptiles: { type: Number, min: 0, max: 5, default: 0 },
    },
    bestSeason: {
      type: String,
      default: "",
    },
    travelTime: {
      type: String, // e.g. "4 hours from Mongla"
      default: "",
    },
    distance: {
      type: String, // e.g. "80 km from Khulna"
      default: "",
    },
    boatTime: {
      type: String, // e.g. "3.5 hours"
      default: "",
    },
    tourPackages: {
      type: [String], // referenced packages titles or IDs
      default: [],
    },
    tips: {
      type: [String], // travel warnings or suggestions
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Place = (mongoose.models.Place || mongoose.model("Place", placeSchema)) as any;
