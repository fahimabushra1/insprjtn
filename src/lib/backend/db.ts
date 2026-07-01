import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js DNS resolution order and server issues with MongoDB SRV records
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.warn("Could not set DNS servers:", error);
}

let cachedConnection: typeof mongoose | null = null;

/**
 * Connects to MongoDB using a cached connection to prevent creating 
 * multiple connections in serverless environments.
 */
export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  try {
    const conn = await mongoose.connect(mongodbUri);
    cachedConnection = conn;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}
