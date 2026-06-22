"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiLayout,
  FiCompass,
  FiBookOpen,
  FiImage,
  FiMessageSquare,
  FiDollarSign,
  FiUser,
  FiMail,
  FiLogOut,
  FiHome,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes";

const ADMIN_LINKS = [
  { href: ROUTES.ADMIN, label: "Overview", icon: FiLayout },
  { href: `${ROUTES.ADMIN}/packages`, label: "Packages", icon: FiCompass },
  { href: `${ROUTES.ADMIN}/bookings`, label: "Bookings", icon: FiBookOpen },
  { href: `${ROUTES.ADMIN}/payments`, label: "Payments", icon: FiDollarSign },
  { href: `${ROUTES.ADMIN}/blogs`, label: "Blogs", icon: FiBookOpen },
  { href: `${ROUTES.ADMIN}/gallery`, label: "Gallery", icon: FiImage },
  { href: `${ROUTES.ADMIN}/testimonials`, label: "Testimonials", icon: FiMessageSquare },
  { href: `${ROUTES.ADMIN}/users`, label: "Users", icon: FiUser },
  { href: `${ROUTES.ADMIN}/contacts`, label: "Contact Messages", icon: FiMail },
];

export default function AdminLayout({ children }) {
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace(`${ROUTES.LOGIN}?redirect=${pathname}`);
      } else if (!isAdmin) {
        router.replace(ROUTES.FORBIDDEN);
      }
    }
  }, [loading, isAuthenticated, isAdmin, router, pathname]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Let the redirect trigger
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200/80 bg-white">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-emerald-950">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-sm">
              IP
            </span>
            <span className="tracking-tight">Insaniat Parjatan</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 border-b border-slate-100 p-6">
          <Avatar className="h-10 w-10 border border-emerald-600/10">
            <AvatarImage src={user?.photo} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <FiUser className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <h4 className="truncate text-sm font-semibold text-slate-900">{user?.name}</h4>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "text-primary bg-primary/5 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-admin-nav"
                    className="absolute inset-y-2 left-0 w-1.5 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-slate-100 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 rounded-xl" asChild>
            <Link href={ROUTES.HOME}>
              <FiHome className="h-5 w-5 text-slate-400" />
              Main Website
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
          >
            <FiLogOut className="h-5 w-5 text-red-400" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-8 backdrop-blur-md">
          <h2 className="text-lg font-bold text-slate-800">
            {ADMIN_LINKS.find((l) => l.href === pathname)?.label || "Admin Console"}
          </h2>
          <span className="text-xs text-muted-foreground bg-slate-100 px-3 py-1 rounded-full font-medium">
            System Operational
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
