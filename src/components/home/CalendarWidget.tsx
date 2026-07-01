"use client";

import React from "react";
import { useHolidays, useSeasons, useAvailabilities } from "@/hooks/useCalendar";
import { useLanguage } from "@/providers/LanguageProvider";
import { FiCalendar, FiSun, FiUsers, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export default function CalendarWidget() {
  const { language } = useLanguage();
  
  // Queries
  const { data: holidaysRes } = useHolidays();
  const { data: seasonsRes } = useSeasons();
  const { data: availabilitiesRes } = useAvailabilities();

  const holidays = holidaysRes?.data || [];
  const seasons = seasonsRes?.data || [];
  const availabilities = availabilitiesRes?.data || [];

  // Current Date logic (Simulating July 1, 2026)
  const currentSimDateStr = "2026-07-01";
  const currentMonthNum = 7; // July

  // 1. Next Holiday
  const nextHoliday = holidays.find((h: any) => h.date >= currentSimDateStr);

  // 2. Next Long Weekend (Simple lookup from holidays flagged or matching)
  const nextLongWeekend = holidays.find((h: any) => {
    if (h.date < currentSimDateStr) return false;
    const date = new Date(h.date);
    const day = date.getDay(); // 0-6
    return day === 4 || day === 5 || day === 6 || day === 0; // Thurs-Sun holidays naturally make long weekends
  });

  // 3. Current Weather
  const currentSeason = seasons.find((s: any) => s.month === currentMonthNum);

  // 4. Next Available Tour from custom overrides
  const nextAvailable = availabilities.find((a: any) => a.date >= currentSimDateStr && a.status !== "full" && a.status !== "closed");

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-slate-900 border-t border-b">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4">
          <div>
            <span className="text-xs uppercase font-black text-primary tracking-wider">
              {language === "en" ? "Interactive Planner" : "সহজ ভ্রমণ পরিকল্পনা"}
            </span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 md:text-3xl mt-1">
              {language === "en" ? "Sundarban Travel Advisor" : "সুন্দরবন ভ্রমণ নির্দেশক"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              {language === "en" ? "Check upcoming travel ratings, weather conditions, and holiday seat availability instantly." : "ছুটি ও ভ্রমণের উপযুক্ত সময়, আবহাওয়া এবং সিট বুকিং সংক্রান্ত তথ্যাদি একনজরে দেখুন।"}
            </p>
          </div>
          <Button variant="outline" asChild className="rounded-xl shrink-0">
            <Link href="/calendar" className="flex items-center gap-1">
              <span>{language === "en" ? "Open Full Calendar" : "সম্পূর্ণ ক্যালেন্ডার"}</span>
              <FiArrowRight />
            </Link>
          </Button>
        </div>

        {/* Widget Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Next Holiday */}
          <div className="p-5 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <FiCalendar className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase">{language === "en" ? "Next Public Holiday" : "পরবর্তী সরকারি ছুটি"}</h4>
              <p className="font-black text-sm text-slate-800 dark:text-slate-100 line-clamp-1">
                {nextHoliday ? (language === "en" ? nextHoliday.title : nextHoliday.titleBn) : "N/A"}
              </p>
            </div>
            <div className="text-xs text-slate-500 font-bold">
              {nextHoliday ? nextHoliday.date : "No upcoming holidays"}
            </div>
          </div>

          {/* Long Weekend */}
          <div className="p-5 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2 w-10 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                <FiTrendingUp className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase">{language === "en" ? "Next Long Weekend" : "পরবর্তী দীর্ঘ ছুটি"}</h4>
              <p className="font-black text-sm text-slate-800 dark:text-slate-100 line-clamp-1">
                {nextLongWeekend ? (language === "en" ? nextLongWeekend.title : nextLongWeekend.titleBn) : "N/A"}
              </p>
            </div>
            <div className="text-xs text-yellow-600 font-bold">
              {nextLongWeekend ? `${nextLongWeekend.date} (Long Weekend)` : "Detecting..."}
            </div>
          </div>

          {/* Current Weather */}
          <div className="p-5 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <FiSun className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase">{language === "en" ? "Current Weather (July)" : "বর্তমান আবহাওয়া (জুলাই)"}</h4>
              <p className="font-black text-sm text-slate-800 dark:text-slate-100">
                {currentSeason ? currentSeason.weather : "Rainy"} ({currentSeason ? currentSeason.temperature : "27°C - 33°C"})
              </p>
            </div>
            <div className="text-xs text-slate-500 font-bold">
              {currentSeason ? currentSeason.riverCondition : "Moderate"} River
            </div>
          </div>

          {/* Remaining Seats */}
          <div className="p-5 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="p-2 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FiUsers className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase">{language === "en" ? "Next Open Group Tour" : "পরবর্তী বুকিং ফ্লো"}</h4>
              <p className="font-black text-sm text-slate-800 dark:text-slate-100">
                {nextAvailable ? nextAvailable.date : "Daily sailings"}
              </p>
            </div>
            <div className="text-xs text-emerald-600 font-bold">
              {nextAvailable ? `${nextAvailable.remainingSeats} Seats Left` : "Tours Available"}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
