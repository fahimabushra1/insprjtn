import * as adminModule from "firebase-admin";

const admin: any = (adminModule as any).apps 
  ? adminModule 
  : ((adminModule as any).default || adminModule);

let firebaseApp: any = null;

/**
 * Initializes the Firebase Admin SDK using environment credentials.
 * Ensures the SDK is only initialized once.
 */
export function initFirebase() {
  if (firebaseApp) return firebaseApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin SDK credentials missing. Authorization features will fail.");
    return null;
  }

  // Format private key correctly if it has escaped newline characters
  privateKey = privateKey.replace(/\\n/g, "\n");

  if ((admin as any).apps.length > 0) {
    firebaseApp = (admin as any).apps[0]!;
  } else {
    firebaseApp = admin.initializeApp({
      credential: (admin as any).credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  console.log("Firebase Admin SDK initialized successfully.");
  return firebaseApp;
}

/**
 * Gets the Firebase Auth instance.
 */
export function getFirebaseAuth() {
  initFirebase();
  return (admin as any).auth();
}
