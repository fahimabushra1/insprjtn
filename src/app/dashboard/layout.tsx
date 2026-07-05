"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiGrid, FiCalendar, FiCreditCard, FiUser, FiLogOut, FiHome, FiMenu } from "react-icons/fi";

import { useAuth } from "@/hooks/useAuth";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: FiGrid },
    { label: "My Bookings", href: "/dashboard/bookings", icon: FiCalendar },
    { label: "Payment History", href: "/dashboard/payments", icon: FiCreditCard },
    { label: "Profile", href: "/dashboard/profile", icon: FiUser },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-emerald-950 text-white p-6">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wider text-emerald-400">Insaniat Parjatan</span>
        </div>

        {/* User Card */}
        <div className="rounded-lg bg-emerald-900/50 p-4">
          <p className="text-xs text-emerald-300">Logged in as</p>
          <p className="font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-emerald-400 font-medium capitalize mt-1">{user?.role}</p>
        </div>

        <Separator className="bg-emerald-900" />

        {/* Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-100 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-emerald-200 hover:bg-emerald-900 hover:text-white transition-colors"
        >
          <FiHome className="h-5 w-5" />
          Back to Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-300 hover:bg-red-950/30 hover:text-red-200 transition-colors"
        >
          <FiLogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 md:block shrink-0 border-r border-slate-100">
        {SidebarContent()}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar on mobile */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <span className="font-bold text-emerald-900">Insaniat Parjatan</span>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-emerald-950">
                <FiMenu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-none">
              {SidebarContent()}
            </SheetContent>
          </Sheet>
        </header>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
