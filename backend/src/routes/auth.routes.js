import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { registerSchema, updateProfileSchema } from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register
);

router.get("/me", verifyFirebaseToken, authController.getMe);

router.patch(
  "/profile",
  verifyFirebaseToken,
  validate(updateProfileSchema),
  authController.updateProfile
);

export default router;
