import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Booking } from "@/lib/db/models/Booking.model";
import { Package } from "@/lib/db/models/Package.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const createBookingSchema = z.object({
  packageId: z.string().min(1, "Package ID is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date format",
  }),
  guests: z.number().int().min(1, "Must have at least 1 guest"),
  notes: z.string().optional().default(""),
});

import { backendLogger } from "@/lib/backend/logger";

export async function GET(request: NextRequest) {
  const reqStart = Date.now();
  backendLogger.info(`GET /api/bookings started`);
  try {
    const { user } = await verifyAuth(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const userIdParam = searchParams.get("userId");

    const filter: any = {};
    if (user.role === "admin") {
      if (userIdParam) {
        filter.userId = userIdParam;
      }
    } else {
      // Customers can only see their own bookings
      filter.userId = user._id;
    }

    const skip = (page - 1) * limit;

    const queryStart = Date.now();
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("packageId", "title duration price location images slug")
        .populate("paymentId")
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter),
    ]);
    backendLogger.info(`MongoDB Booking query took ${Date.now() - queryStart}ms`);

    // Map bookings to ensure nested populated objects are never null
    const sanitizedBookings = bookings.map((booking: any) => ({
      ...booking,
      userId: booking.userId || {
        _id: "deleted-user",
        name: "Deleted User",
        email: "deleted@insprjtn.com",
        phone: "N/A"
      },
      packageId: booking.packageId || {
        _id: "deleted-package",
        title: "Deleted Package",
        duration: "N/A",
        price: 0,
        location: "N/A",
        images: [],
        slug: ""
      }
    }));

    backendLogger.info(`GET /api/bookings finished in ${Date.now() - reqStart}ms`);
    return apiResponse(
      200,
      {
        items: sanitizedBookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Bookings retrieved successfully"
    );
  } catch (error: any) {
    backendLogger.error("GET /api/bookings error", error);
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    const body = await request.json();

    const parseResult = createBookingSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    // Fetch the package to calculate the price
    const pkg = await Package.findById(sanitized.packageId);
    if (!pkg) {
      return apiError(404, "Package not found");
    }

    const totalPrice = pkg.price * sanitized.guests;

    const booking = await Booking.create({
      userId: user._id,
      packageId: sanitized.packageId,
      startDate: new Date(sanitized.startDate),
      guests: sanitized.guests,
      totalPrice,
      notes: sanitized.notes,
      bookingStatus: "pending",
      paymentStatus: "pending",
    });

    return apiResponse(201, booking, "Booking created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

