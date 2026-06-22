/**
 * Initial Admin Seeding Script
 * Creates or updates the primary admin user in both Firebase Auth and MongoDB.
 * Run: node scripts/seed-admin.js
 */
import admin from "firebase-admin";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/User.model.js";

dotenv.config();

const ADMIN_EMAIL = "bushra.arifeen@gmail.com";
const ADMIN_NAME = "Bushra Arifeen";
const TEMP_PASSWORD = "AdminInsaniat2026!";

const initFirebase = () => {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    throw new Error("Firebase Admin SDK credentials not fully configured in environment variables");
  }
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
};

async function seedAdmin() {
  // 1. Connect MongoDB
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // 2. Initialize Firebase
  initFirebase();
  const auth = admin.auth();
  console.log("Firebase Admin SDK initialized");

  let firebaseUser;
  try {
    // Check if user exists in Firebase Auth
    firebaseUser = await auth.getUserByEmail(ADMIN_EMAIL);
    console.log(`User already exists in Firebase Auth (UID: ${firebaseUser.uid})`);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      // Create user in Firebase Auth
      console.log(`User not found in Firebase Auth. Creating account for ${ADMIN_EMAIL}...`);
      firebaseUser = await auth.createUser({
        email: ADMIN_EMAIL,
        password: TEMP_PASSWORD,
        displayName: ADMIN_NAME,
        emailVerified: true,
      });
      console.log(`Successfully created user in Firebase Auth (UID: ${firebaseUser.uid})`);
      console.log(`Temporary login password: ${TEMP_PASSWORD}`);
    } else {
      throw err;
    }
  }

  // 3. Upsert user in MongoDB with role: "admin"
  const user = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      $set: {
        firebaseUid: firebaseUser.uid,
        name: ADMIN_NAME,
        role: "admin",
      },
    },
    { new: true, upsert: true }
  );

  console.log(`MongoDB Admin user profile set:`);
  console.log({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    firebaseUid: user.firebaseUid,
  });

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seedAdmin().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
