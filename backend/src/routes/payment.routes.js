import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import {
  submitPaymentSchema,
  paymentIdSchema,
} from "../validators/payment.validator.js";

const router = Router();

// Apply auth to all payment routes
router.use(verifyFirebaseToken);

router.post("/submit", validate(submitPaymentSchema), paymentController.submitPayment);
router.get("/", paymentController.getPayments);

// Admin-only route
router.post("/:id/verify", requireRole("admin"), validate(paymentIdSchema), paymentController.verifyPayment);

export default router;
