"use client";

import React, { useState } from "react";
import { useHolidays, useSeasons, useAnnouncements, useAvailabilities } from "@/hooks/useCalendar";
import TravelCalendar from "@/components/calendar/TravelCalendar";
import SeasonInfo from "@/components/calendar/SeasonInfo";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import { useLanguage } from "@/providers/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertOctagon, FiCalendar, FiFilter, FiInfo, FiTag, FiTrendingUp } from "react-icons/fi";
import { formatDate } from "@/utils/format";

export default function CalendarPage() {
  const { language } = useLanguage();
  
  // Queries
  const { data: holidaysRes, isLoading: holidaysLoading } = useHolidays();
  const { data: seasonsRes, isLoading: seasonsLoading } = useSeasons();
  const { data: announcementsRes, isLoading: announcementsLoading } = useAnnouncements();
  const { data: availabilitiesRes, isLoading: availabilitiesLoading } = useAvailabilities();

  const holidays = holidaysRes?.data || [];
  const seasons = seasonsRes?.data || [];
  const announcements = announcementsRes?.data || [];
  const availabilities = availabilitiesRes?.data || [];

  // Filter state
  const [filterType, setFilterType] = useState<string>("all");
  const [activeMonth, setActiveMonth] = useState<number>(7); // Default to July

  if (holidaysLoading || seasonsLoading || announcementsLoading || availabilitiesLoading) {
    return <FullPageLoader />;
  }

  const currentSeason = seasons.find((s) => s.month === activeMonth);

  // Filtered upcoming holidays/events in current viewed month or next
  const activeAnnouncements = announcements.filter((a) => {
    const today = new Date("2026-07-01"); // Align with project current simulated date
    const end = new Date(a.endDate);
    return end >= today;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-16">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            {language === "en" ? "Interactive Travel Guide" : "ইন্টারেক্টিভ ভ্রমণ গাইড"}
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {language === "en" ? "Sundarban " : "সুন্দরবন "}
            <span className="text-primary">{language === "en" ? "Travel Calendar" : "ভ্রমণ ক্যালেন্ডার"}</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            {language === "en"
              ? "Plan your perfect Sundarban cruise. View official holidays, seasonal climate details, wildlife spotting ratings, and real-time boat seating availability."
              : "আপনার নিখুঁত সুন্দরবন ভ্রমণের পরিকল্পনা করুন। সরকারি ছুটির তালিকা, জলবায়ু পরিস্থিতি, বন্যপ্রাণী দেখার সম্ভাবনা এবং বুকিং তথ্য একনজরে দেখুন।"}
          </p>
        </div>

        {/* Announcements Banner */}
        {activeAnnouncements.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-3">
            {activeAnnouncements.map((announce) => (
              <div
                key={announce._id}
                className={cn(
                  "p-4 rounded-xl border flex items-start gap-3 shadow-sm",
                  announce.priority === "high"
                    ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200"
                    : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200"
                )}
              >
                <FiAlertOctagon className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">
                    {announce.priority === "high" ? "Urgent Forest Notice" : "Forest Department Notice"}
                  </h4>
                  <p className="text-sm font-bold mt-0.5">{announce.title}</p>
                  <p className="text-xs opacity-90 mt-1">{announce.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Bar */}
        <div className="max-w-5xl mx-auto bg-card rounded-2xl border p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 dark:text-emerald-50">
            <FiFilter className="text-primary" />
            <span>{language === "en" ? "Filter Calendar:" : "ক্যালেন্ডার ফিল্টার করুন:"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", labelEn: "All Days", labelBn: "সব দিন" },
              { id: "holiday", labelEn: "Govt Holidays", labelBn: "সরকারি ছুটি" },
              { id: "long-weekend", labelEn: "Long Weekends", labelBn: "দীর্ঘ ছুটি" },
              { id: "wildlife", labelEn: "Best Wildlife", labelBn: "সেরা বন্যপ্রাণী" },
              { id: "birds", labelEn: "Best Birdwatching", labelBn: "পাখি দেখার সময়" },
              { id: "available", labelEn: "Available Tours", labelBn: "খালি ট্যুর" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border",
                  filterType === filter.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-slate-50 dark:bg-slate-900 text-muted-foreground border-border hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {language === "en" ? filter.labelEn : filter.labelBn}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar & Season Info Grid */}
        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-3">
          {/* Calendar (Left 2 columns) */}
          <div className="lg:col-span-2">
            <TravelCalendar
              holidays={holidays}
              availabilities={availabilities}
              announcements={announcements}
              seasons={seasons}
              onMonthChange={(m) => setActiveMonth(m)}
              activeFilters={{ type: filterType }}
            />
          </div>

          {/* Season Details Sidebar (Right 1 column) */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMonth}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SeasonInfo season={currentSeason} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Monthly Score Highlight Section */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-emerald-100 dark:border-emerald-950/20 bg-card p-6 shadow-md">
          <h3 className="font-extrabold text-base text-emerald-950 dark:text-emerald-50 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-primary" />
            <span>{language === "en" ? "Best Time to Visit Rankings" : "ভ্রমণের জন্য সেরা সময়ের র‍্যাঙ্কিং"}</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { score: 5, monthsEn: "November - February", monthsBn: "নভেম্বর - ফেব্রুয়ারি", descEn: "Peak Season. Ideal cool weather, high wildlife viewing, and calmest seas.", descBn: "সেরা ঋতু। আরামদায়ক ঠাণ্ডা আবহাওয়া, বাঘ ও হরিণ দেখার সর্বোচ্চ সম্ভাবনা।" },
              { score: 4, monthsEn: "March & October", monthsBn: "মার্চ ও অক্টোবর", descEn: "Good Season. Slightly warm or fresh post-monsoon foliage.", descBn: "অনুকূল সময়। কিছুটা উষ্ণ অথবা বর্ষার পর বনের নতুন সতেজ রূপ।" },
              { score: 1, monthsEn: "June - September", monthsBn: "জুন - সেপ্টেম্বর", descEn: "Monsoon. Rough rivers, flooding risks, and heavy cyclonic storms.", descBn: "বর্ষাকাল। উত্তাল নদী ও ঝড় বৃষ্টির ঝুঁকি থাকে বিধায় ট্যুর বন্ধ থাকে।" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs text-primary">{language === "en" ? item.monthsEn : item.monthsBn}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-xs ${i < item.score ? "text-yellow-500" : "text-slate-200 dark:text-slate-700"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === "en" ? item.descEn : item.descBn}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline helper for layout styling
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
