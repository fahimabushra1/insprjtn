import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
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
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentBn: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Blog = (mongoose.models.Blog || mongoose.model("Blog", blogSchema)) as any;

