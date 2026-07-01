import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Booking } from "@/lib/db/models/Booking.model";
import { Payment } from "@/lib/db/models/Payment.model";
import { Package } from "@/lib/db/models/Package.model";
import { User } from "@/lib/db/models/User.model";
import { Contact } from "@/lib/db/models/Contact.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";

export async function GET(request: NextRequest) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    await connectDB();

    // 1. Basic counts
    const [
      bookingsCount,
      packagesCount,
      usersCount,
      pendingPaymentsCount,
      unresolvedContactsCount,
    ] = await Promise.all([
      Booking.countDocuments({}),
      Package.countDocuments({}),
      User.countDocuments({}),
      Payment.countDocuments({ paymentStatus: "pending" }),
      Contact.countDocuments({ status: "pending" }),
    ]);

    // 2. Aggregate total paid revenue
    const revenueAggregation = await Payment.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueAggregation[0]?.total || 0;

    // 3. Package popularity (group bookings by package)
    const popularPackages = await Booking.aggregate([
      {
        $group: {
          _id: "$packageId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "packages",
          localField: "_id",
          foreignField: "_id",
          as: "packageInfo",
        },
      },
      { $unwind: "$packageInfo" },
      {
        $project: {
          _id: 1,
          count: 1,
          title: "$packageInfo.title",
          location: "$packageInfo.location",
          price: "$packageInfo.price",
        },
      },
    ]);

    // 4. Monthly revenue metrics (grouped by year/month)
    const monthlyRevenue = await Payment.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$paidAt" },
            month: { $month: "$paidAt" },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          revenue: 1,
        },
      },
    ]);

    // 5. Recent bookings activity
    const recentBookings = await Booking.find()
      .sort("-createdAt")
      .limit(5)
      .populate("packageId", "title")
      .populate("userId", "name email")
      .lean();

    const stats = {
      bookingsCount,
      packagesCount,
      usersCount,
      pendingPaymentsCount,
      unresolvedContactsCount,
      totalRevenue,
    };

    return apiResponse(
      200,
      {
        stats,
        popularPackages,
        monthlyRevenue: monthlyRevenue.reverse(),
        recentBookings,
      },
      "Admin analytics retrieved successfully"
    );
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
