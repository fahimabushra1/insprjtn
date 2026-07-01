"use client";

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface TravelCalendarProps {
  holidays: any[];
  availabilities: any[];
  announcements: any[];
  seasons: any[];
  onMonthChange?: (month: number) => void;
  activeFilters: {
    type: string; // "all" | "holiday" | "long-weekend" | "wildlife" | "birds" | "available"
  };
}

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_BN = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];

export default function TravelCalendar({
  holidays = [],
  availabilities = [],
  announcements = [],
  seasons = [],
  onMonthChange,
  activeFilters,
}: TravelCalendarProps) {
  const { language } = useLanguage();
  
  // Set default view to July 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    const nextDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(nextDate);
    if (onMonthChange) onMonthChange(nextDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const nextDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(nextDate);
    if (onMonthChange) onMonthChange(nextDate.getMonth() + 1);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Helper: Format date to YYYY-MM-DD
  const formatDateString = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // Helper: Find government holiday
  const getHolidayForDay = (day: number) => {
    const dateStr = formatDateString(day);
    return holidays.find((h) => h.date === dateStr);
  };

  // Helper: Find availability override
  const getAvailabilityForDay = (day: number) => {
    const dateStr = formatDateString(day);
    return availabilities.find((a) => a.date === dateStr);
  };

  // Helper: Detect long weekend
  const isLongWeekend = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    const dateStr = formatDateString(day);

    const isGovHoliday = holidays.some((h) => h.date === dateStr);
    if (isGovHoliday) {
      // Holiday is next to a weekend (Fri/Sat)
      return true;
    }

    // If it's a weekend day (Fri/Sat), and there's a holiday adjacent to it
    if (dayOfWeek === 5) {
      // Friday: check if Thursday or Sunday is a holiday
      const prevDateStr = formatDateString(day - 1);
      const nextDateStr = formatDateString(day + 2);
      if (holidays.some((h) => h.date === prevDateStr || h.date === nextDateStr)) {
        return true;
      }
    }
    if (dayOfWeek === 6) {
      // Saturday: check if Sunday or Thursday is a holiday
      const prevDateStr = formatDateString(day - 2);
      const nextDateStr = formatDateString(day + 1);
      if (holidays.some((h) => h.date === prevDateStr || h.date === nextDateStr)) {
        return true;
      }
    }

    return false;
  };

  // Helper: Get best recommendation badges/ratings based on month details
  const getDayRecommendation = (day: number) => {
    const holiday = getHolidayForDay(day);
    const availability = getAvailabilityForDay(day);
    const longWeek = isLongWeekend(day);
    
    let recommendation = "";
    let ratingStars = "⭐⭐⭐⭐⭐";

    const monthSeason = seasons.find((s) => s.month === currentMonth + 1);
    if (monthSeason) {
      if (monthSeason.bestTimeScore === 5) {
        recommendation = language === "en" ? "Excellent Time" : "সেরা সময়";
        ratingStars = "⭐⭐⭐⭐⭐";
      } else if (monthSeason.bestTimeScore === 4) {
        recommendation = language === "en" ? "Highly Recommended" : "বিশেষ পরামর্শিত";
        ratingStars = "⭐⭐⭐⭐☆";
      } else if (monthSeason.bestTimeScore === 3) {
        recommendation = language === "en" ? "Good Time" : "ভালো সময়";
        ratingStars = "⭐⭐⭐☆☆";
      } else if (monthSeason.bestTimeScore === 2) {
        recommendation = language === "en" ? "Warm Weather" : "উষ্ণ আবহাওয়া";
        ratingStars = "⭐⭐☆☆☆";
      } else {
        recommendation = language === "en" ? "Avoid Monsoon Heavy Rain" : "বর্ষার কারণে এড়িয়ে চলুন";
        ratingStars = "⭐☆☆☆☆";
      }
    }

    return { holiday, availability, longWeek, recommendation, ratingStars, monthSeason };
  };

  const renderDays = () => {
    const days = [];

    // Fill blank cells before the first day of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[100px] border border-emerald-950/5 bg-slate-50/20 dark:bg-slate-900/10 rounded-lg" />
      );
    }

    // Fill the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(day);
      const { holiday, availability, longWeek, recommendation, ratingStars, monthSeason } = getDayRecommendation(day);

      // Determine day color code based on seat status/availability
      let statusColor = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 border-emerald-100 dark:border-emerald-950/40"; // Default: Excellent/Available (Green)
      let dotColor = "bg-emerald-500";
      let statusText = language === "en" ? "Tours Available" : "ট্যুর বুকিং খোলা";
      
      if (availability) {
        if (availability.status === "full") {
          statusColor = "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-300 border-red-100 dark:border-red-950/50";
          dotColor = "bg-red-500";
          statusText = language === "en" ? "Fully Booked" : "পূর্ণ বুকড";
        } else if (availability.status === "limited") {
          statusColor = "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border-amber-100 dark:border-amber-950/50";
          dotColor = "bg-amber-500";
          statusText = language === "en" ? `Limited Seats (${availability.remainingSeats})` : `সীমিত সিট বাকি (${availability.remainingSeats})`;
        } else if (availability.status === "closed") {
          statusColor = "bg-slate-100 dark:bg-slate-950/60 text-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-800";
          dotColor = "bg-slate-900 dark:bg-slate-200";
          statusText = language === "en" ? "Closed / Suspended" : "বন বিভাগ কর্তৃক বন্ধ";
        }
      }

      // Apply Filters
      let isFilteredOut = false;
      if (activeFilters.type === "holiday" && !holiday) isFilteredOut = true;
      if (activeFilters.type === "long-weekend" && !longWeek) isFilteredOut = true;
      if (activeFilters.type === "wildlife" && (!monthSeason || monthSeason.tigerActivity < 4)) isFilteredOut = true;
      if (activeFilters.type === "birds" && (!monthSeason || monthSeason.birdWatching < 4)) isFilteredOut = true;
      if (activeFilters.type === "available" && availability?.status === "full") isFilteredOut = true;

      days.push(
        <div
          key={`day-${day}`}
          className={cn(
            "min-h-[110px] border p-2 rounded-xl transition-all relative flex flex-col justify-between group shadow-sm",
            statusColor,
            isFilteredOut ? "opacity-35 blur-[0.5px]" : "hover:shadow-md hover:scale-[1.01]"
          )}
        >
          {/* Day Header (Date & Holiday flag icon) */}
          <div className="flex justify-between items-start">
            <span className="text-sm font-black">{day}</span>
            <div className="flex gap-1 items-center">
              {holiday && (
                <span className="text-[10px] px-1 bg-red-600 text-white rounded font-bold" title={holiday.title}>
                  H
                </span>
              )}
              {longWeek && (
                <span className="text-[10px] px-1 bg-yellow-500 text-slate-950 rounded font-bold" title="Long Weekend">
                  LW
                </span>
              )}
            </div>
          </div>

          {/* Day Middle (Weather icons or quick tips) */}
          <div className="my-1.5 flex flex-col gap-0.5">
            {holiday && (
              <span className="text-[10px] font-bold leading-tight text-red-600 dark:text-red-400 line-clamp-1">
                {language === "en" ? holiday.title : holiday.titleBn}
              </span>
            )}
            {monthSeason && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                <span>{monthSeason.weather}</span>
                {monthSeason.tigerActivity >= 4 && <span title="High Tiger sightings">🐅</span>}
                {monthSeason.birdWatching >= 4 && <span title="Excellent Birdwatching">🦜</span>}
              </div>
            )}
          </div>

          {/* Day Footer (Availability pill / dot) */}
          <div className="flex items-center gap-1.5 text-[9px] font-bold border-t pt-1.5 border-emerald-950/5">
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor)} />
            <span className="truncate">{statusText}</span>
          </div>

          {/* Premium Hover Detail Card (Tooltip) */}
          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 z-20 mb-2 hidden w-64 rounded-2xl bg-slate-950 dark:bg-slate-900 border border-emerald-950/20 p-4 shadow-xl text-white group-hover:block transition-all">
            <div className="text-xs border-b border-white/10 pb-2 mb-2">
              <span className="font-black text-sm block">{day} {language === "en" ? MONTHS_EN[currentMonth] : MONTHS_BN[currentMonth]} {currentYear}</span>
              {holiday && (
                <span className="text-red-400 font-bold block mt-1">
                  🇧🇩 {language === "en" ? holiday.title : holiday.titleBn}
                </span>
              )}
              {longWeek && (
                <span className="text-yellow-400 font-bold block mt-0.5">
                  ✨ {language === "en" ? "Long Weekend" : "দীর্ঘ ছুটির দিন"}
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{language === "en" ? "Weather" : "আবহাওয়া"}:</span>
                <span className="font-bold">{monthSeason?.weather || "Pleasant"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{language === "en" ? "Wildlife" : "বন্যপ্রাণী"}:</span>
                <span className="font-bold">{ratingStars}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{language === "en" ? "Recommendation" : "পরামর্শ"}:</span>
                <span className="font-bold text-emerald-400">{recommendation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">{language === "en" ? "Booking" : "বুকিং"}:</span>
                <span className="font-bold">{statusText}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full rounded-2xl border border-emerald-100 dark:border-emerald-950/20 bg-card p-6 shadow-md">
      {/* Calendar Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4 border-emerald-950/5">
        <h3 className="font-extrabold text-lg flex items-center gap-2 text-emerald-950 dark:text-emerald-50">
          <FiCalendar className="text-primary h-5 w-5" />
          <span>{language === "en" ? "Travel Planner Calendar" : "ভ্রমণ পরিকল্পনাকারী ক্যালেন্ডার"}</span>
        </h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground border"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-base font-black text-slate-800 dark:text-slate-100 w-36 text-center">
            {language === "en" ? MONTHS_EN[currentMonth] : MONTHS_BN[currentMonth]} {currentYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground border"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground mb-2">
        {(language === "en" ? DAYS_EN : DAYS_BN).map((day) => (
          <div key={day} className="py-2 bg-emerald-950/5 dark:bg-emerald-950/15 rounded-lg">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>

      {/* Calendar Legend */}
      <div className="mt-6 border-t pt-4 border-emerald-950/5">
        <h4 className="text-xs font-black uppercase text-emerald-950 dark:text-emerald-50 mb-3">
          {language === "en" ? "Calendar Legend" : "ক্যালেন্ডার সংকেত"}
        </h4>
        <div className="flex flex-wrap gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">{language === "en" ? "🟢 Excellent (Tours Available)" : "🟢 বুকিং খোলা (Excellent)"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">{language === "en" ? "🟡 Good (Limited Seats)" : "🟡 সীমিত সিট (Good)"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">{language === "en" ? "🔴 Avoid (Fully Booked)" : "🔴 বুকিং শেষ (Avoid)"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-900 dark:bg-slate-200" />
            <span className="text-muted-foreground">{language === "en" ? "⚫ Closed / Forest restrictions" : "⚫ বন্ধ (Closed)"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
