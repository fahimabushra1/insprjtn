import { Router } from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../validators/booking.validator.js";

const router = Router();

// Apply auth to all booking routes
router.use(verifyFirebaseToken);

router.post("/", validate(createBookingSchema), bookingController.createBooking);
router.get("/", bookingController.getBookings);
router.get("/:id", bookingController.getBookingById);
router.patch("/:id/cancel", bookingController.cancelBooking);

// Admin-only route
router.patch("/:id/status", requireRole("admin"), validate(updateBookingStatusSchema), bookingController.updateBookingStatus);

export default router;
