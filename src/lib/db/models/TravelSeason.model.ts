import mongoose from "mongoose";

const travelSeasonSchema = new mongoose.Schema(
  {
    month: {
      type: Number, // 1 for January, 12 for December
      required: true,
      unique: true,
      min: 1,
      max: 12,
      index: true,
    },
    temperature: {
      type: String, // e.g. "18°C - 27°C"
      required: true,
    },
    humidity: {
      type: String, // e.g. "65%"
      required: true,
    },
    rainfall: {
      type: String, // e.g. "Very Low"
      required: true,
    },
    riverCondition: {
      type: String, // e.g. "Calm"
      required: true,
    },
    weather: {
      type: String, // e.g. "Cool & Dry"
      required: true,
    },
    tourRecommendation: {
      type: String, // e.g. "Best Month", "Avoid Heavy Rain", etc.
      required: true,
    },
    birdWatching: {
      type: Number, // 1 to 5 stars
      min: 1,
      max: 5,
      default: 3,
    },
    tigerActivity: {
      type: Number, // 1 to 5 stars
      min: 1,
      max: 5,
      default: 3,
    },
    photography: {
      type: Number, // 1 to 5 stars
      min: 1,
      max: 5,
      default: 3,
    },
    crowdLevel: {
      type: String, // "Low" | "Medium" | "High"
      required: true,
      default: "Medium",
    },
    mosquitoLevel: {
      type: String, // "Low" | "Medium" | "High"
      required: true,
      default: "Medium",
    },
    forestCondition: {
      type: String, // e.g. "Lush Green"
      required: true,
    },
    recommendedClothing: {
      type: String, // e.g. "Warm jacket, light windbreaker"
      required: true,
    },
    recommendedEquipment: {
      type: String, // e.g. "Binoculars, DSLR with telephoto lens"
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    bestTimeScore: {
      type: Number, // 1 to 5 rating
      min: 1,
      max: 5,
      default: 3,
    },
    bestTimeReason: {
      type: String, // reason text
      default: "",
    },
  },
  { timestamps: true }
);

export const TravelSeason =
  (mongoose.models.TravelSeason || mongoose.model("TravelSeason", travelSeasonSchema)) as any;
