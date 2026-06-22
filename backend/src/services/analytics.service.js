import { Booking } from "../models/Booking.model.js";
import { Payment } from "../models/Payment.model.js";
import { Package } from "../models/Package.model.js";
import { User } from "../models/User.model.js";
import { Contact } from "../models/Contact.model.js";

export const getAdminStats = async () => {
  // 1. Basic counts and revenue sum
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

  // Aggregate total paid revenue
  const revenueAggregation = await Payment.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalRevenue = revenueAggregation[0]?.total || 0;

  // 2. Package popularity (group bookings by package)
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

  // 3. Monthly revenue metrics (grouped by year/month)
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

  // 4. Recent activities (e.g. latest 5 bookings)
  const recentBookings = await Booking.find({})
    .sort("-createdAt")
    .limit(5)
    .populate("packageId", "title")
    .populate("userId", "name email")
    .lean();

  return {
    stats: {
      bookingsCount,
      packagesCount,
      usersCount,
      pendingPaymentsCount,
      unresolvedContactsCount,
      totalRevenue,
    },
    popularPackages,
    monthlyRevenue: monthlyRevenue.reverse(), // chronologically ordered
    recentBookings,
  };
};
