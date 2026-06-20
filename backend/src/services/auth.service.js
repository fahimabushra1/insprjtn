import { getFirebaseAuth } from "../config/firebase.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeObject } from "../utils/sanitize.js";

const formatUser = (user) => ({
  _id: user._id,
  firebaseUid: user.firebaseUid,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  photo: user.photo,
  role: user.role,
  createdAt: user.createdAt,
});

export const registerUser = async (firebaseToken, { name, phone }) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new ApiError(500, "Authentication service unavailable");

  const decoded = await auth.verifyIdToken(firebaseToken);
  const sanitized = sanitizeObject({ name, phone: phone || "" });

  let user = await User.findOne({ firebaseUid: decoded.uid });

  if (user) {
    return formatUser(user);
  }

  const existingEmail = await User.findOne({ email: decoded.email });
  if (existingEmail) {
    throw new ApiError(409, "Email already registered with a different account");
  }

  user = await User.create({
    firebaseUid: decoded.uid,
    name: sanitized.name,
    email: decoded.email,
    phone: sanitized.phone,
    photo: decoded.picture || "",
    role: "customer",
  });

  return formatUser(user);
};

export const getUserByFirebaseUid = async (firebaseUid) => {
  const user = await User.findOne({ firebaseUid });
  if (!user) throw new ApiError(404, "User not found");
  return formatUser(user);
};

export const updateUserProfile = async (userId, updates) => {
  const sanitized = sanitizeObject(updates);
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: sanitized },
    { new: true, runValidators: true }
  );

  if (!user) throw new ApiError(404, "User not found");
  return formatUser(user);
};
