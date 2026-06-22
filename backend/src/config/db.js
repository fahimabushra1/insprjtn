import mongoose from "mongoose";
import { env } from "./env.js";
import {setServers} from "dns/promises";

setServers(["8.8.8.8"]);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
