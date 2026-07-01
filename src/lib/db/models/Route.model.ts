import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startPlace: {
      type: String, // name of start spot
      required: true,
    },
    endPlace: {
      type: String, // name of end spot
      required: true,
    },
    distance: {
      type: String, // e.g. "25 km"
      default: "",
    },
    estimatedTime: {
      type: String, // e.g. "1.5 hours"
      default: "",
    },
    coordinates: {
      type: [[Number]], // Array of [lat, lng] representing path polylines
      required: true,
    },
    transportType: {
      type: String,
      enum: ["boat", "bus", "walk", "car"],
      default: "boat",
      required: true,
    },
  },
  { timestamps: true }
);

export const Route = (mongoose.models.Route || mongoose.model("Route", routeSchema)) as any;
