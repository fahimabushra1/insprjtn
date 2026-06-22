"use client";

import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiMail,
  FiCompass,
  FiBookOpen,
} from "react-icons/fi";
import { useAdminAnalytics } from "@/hooks/useAnalytics";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { data: analyticsRes, isLoading, isError } = useAdminAnalytics();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !analyticsRes?.data) {
    return (
      <div className="py-12 text-center text-destructive">
        Failed to load analytics dashboard statistics.
      </div>
    );
  }

  const { stats, popularPackages, monthlyRevenue, recentBookings } = analyticsRes.data;

  // Month name helper
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("en-US", { month: "short" });
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      desc: "Verified paid bookings",
      icon: FiDollarSign,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Total Bookings",
      value: stats.bookingsCount,
      desc: "All tour requests",
      icon: FiBookOpen,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Registered Users",
      value: stats.usersCount,
      desc: "Active customers & admins",
      icon: FiUsers,
      color: "bg-indigo-500/10 text-indigo-600",
    },
    {
      title: "Pending Inquiries",
      value: stats.unresolvedContactsCount,
      desc: "Requires response",
      icon: FiMail,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="border-slate-200/60 shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <span className="text-sm font-medium text-slate-500">{card.title}</span>
                  <div className={`rounded-xl p-2.5 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 font-medium">{card.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Earnings chart representation */}
        <Card className="border-slate-200/60 shadow-sm bg-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiTrendingUp className="text-primary" />
              Monthly Earnings Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            {monthlyRevenue.length > 0 ? (
              <div className="space-y-4">
                {monthlyRevenue.map((item, idx) => {
                  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue)) || 1;
                  const percentage = Math.min(100, Math.round((item.revenue / maxRevenue) * 100));

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-600">
                          {getMonthName(item.month)} {item.year}
                        </span>
                        <span className="text-slate-900 font-bold">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-emerald-600 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No monthly sales records available yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Packages */}
        <Card className="border-slate-200/60 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FiCompass className="text-primary" />
              Popular Packages
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {popularPackages.length > 0 ? (
              <div className="space-y-5">
                {popularPackages.map((item, idx) => (
                  <div key={item._id} className="flex justify-between items-start gap-4">
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-sm text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {item.count} Booked
                      </span>
                      <p className="text-xs font-bold text-slate-950 mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Packages stat records will display here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Log */}
      <Card className="border-slate-200/60 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Recent Tour Bookings</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3">Customer</th>
                    <th className="py-3">Package</th>
                    <th className="py-3">Total Price</th>
                    <th className="py-3">Booking Status</th>
                    <th className="py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/40">
                      <td className="py-3.5">
                        <div className="font-medium text-slate-900">{booking.userId?.name}</div>
                        <div className="text-xs text-muted-foreground">{booking.userId?.email}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-medium text-slate-900">
                          {booking.packageId?.title || "Deleted Package"}
                        </div>
                      </td>
                      <td className="py-3.5 font-semibold text-slate-900">
                        {formatCurrency(booking.totalPrice)}
                      </td>
                      <td className="py-3.5">
                        <Badge
                          variant={
                            booking.bookingStatus === "confirmed"
                              ? "success"
                              : booking.bookingStatus === "cancelled"
                              ? "destructive"
                              : "warning"
                          }
                          className="capitalize"
                        >
                          {booking.bookingStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-xs text-slate-500">
                        {formatDate(booking.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No recent bookings have been placed yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
