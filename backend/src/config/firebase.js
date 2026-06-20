import admin from "firebase-admin";
import { env } from "./env.js";

let firebaseApp = null;

export const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  if (!env.firebase.projectId || !env.firebase.clientEmail || !env.firebase.privateKey) {
    console.warn("Firebase Admin SDK not configured — auth routes will fail");
    return null;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
  });

  console.log("Firebase Admin SDK initialized");
  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (!firebaseApp) initFirebase();
  return admin.auth();
};
