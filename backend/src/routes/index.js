import { Router } from "express";
import authRoutes from "./auth.routes.js";
import packageRoutes from "./package.routes.js";
import bookingRoutes from "./booking.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

router.use("/auth", authRoutes);
router.use("/packages", packageRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);

export default router;
