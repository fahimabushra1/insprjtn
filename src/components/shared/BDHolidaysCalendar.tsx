"use client";

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { BD_HOLIDAYS_2026, Holiday } from "@/constants/holidays";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface BDHolidaysCalendarProps {
  onSelectDate?: (dateStr: string) => void;
  selectedDate?: string;
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

export default function BDHolidaysCalendar({ onSelectDate, selectedDate }: BDHolidaysCalendarProps) {
  const { language } = useLanguage();
  
  // Default to July 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const getHolidayForDay = (day: number): Holiday | undefined => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return BD_HOLIDAYS_2026.find(h => h.date === dateString);
  };

  const currentMonthHolidays = BD_HOLIDAYS_2026.filter(h => {
    const [hYear, hMonth] = h.date.split("-").map(Number);
    return hYear === currentYear && hMonth === (currentMonth + 1);
  });

  const renderDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-9 w-full bg-transparent" />
      );
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const holiday = getHolidayForDay(day);
      const isSelected = selectedDate === dateString;
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();

      days.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={!onSelectDate}
          onClick={() => onSelectDate && onSelectDate(dateString)}
          className={cn(
            "h-9 w-full rounded-md text-xs font-semibold flex flex-col items-center justify-center transition-colors relative group",
            onSelectDate ? "cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-950/40" : "cursor-default",
            holiday ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-950" : "text-foreground",
            isSelected && "bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white border-emerald-600 hover:bg-emerald-700",
            isToday && !isSelected && "border border-primary text-primary"
          )}
          title={holiday ? (language === "en" ? holiday.nameEn : holiday.nameBn) : undefined}
        >
          <span>{day}</span>
          {holiday && (
            <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-red-500 dark:bg-red-400" />
          )}
          
          {holiday && (
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 z-10 mb-1 hidden w-48 rounded bg-slate-950 p-2 text-center text-[10px] leading-tight text-white shadow-lg group-hover:block dark:bg-slate-800">
              {language === "en" ? holiday.nameEn : holiday.nameBn}
            </span>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-full rounded-xl border border-emerald-100 dark:border-emerald-950/30 bg-card p-4 shadow-sm text-foreground">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm flex items-center gap-1.5 text-emerald-950 dark:text-emerald-50">
          <FiCalendar className="text-primary" />
          <span>
            {language === "en" ? "BD Govt Holidays" : "সরকারি ছুটির ক্যালেন্ডার"}
          </span>
        </h3>
        <span className="text-xs font-semibold text-muted-foreground bg-emerald-950/5 dark:bg-emerald-950/25 px-2 py-0.5 rounded-full">
          2026
        </span>
      </div>

      <div className="flex items-center justify-between mb-3 border-b pb-2 border-emerald-950/5 dark:border-emerald-950/10">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {language === "en" ? MONTHS_EN[currentMonth] : MONTHS_BN[currentMonth]} {currentYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground mb-1">
        {(language === "en" ? DAYS_EN : DAYS_BN).map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {onSelectDate && (
        <p className="mt-3 text-[10px] text-muted-foreground text-center italic">
          {language === "en" 
            ? "* Click on a holiday date to select departure date." 
            : "* প্রস্থান তারিখ নির্বাচন করতে ছুটির দিনে ক্লিক করুন।"}
        </p>
      )}

      <div className="mt-4 border-t pt-3 border-emerald-950/5 dark:border-emerald-950/10">
        <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-50 mb-2">
          {language === "en" 
            ? `Holidays in ${MONTHS_EN[currentMonth]}:` 
            : `${MONTHS_BN[currentMonth]} মাসের সরকারি ছুটিসমূহ:`}
        </h4>
        {currentMonthHolidays.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            {language === "en" ? "No official holidays this month." : "এই মাসে কোনো সরকারি ছুটি নেই।"}
          </p>
        ) : (
          <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {currentMonthHolidays.map((holiday) => {
              const dayNum = parseInt(holiday.date.split("-")[2]);
              const isSelected = selectedDate === holiday.date;
              return (
                <li key={holiday.date} className="text-xs">
                  <button
                    type="button"
                    disabled={!onSelectDate}
                    onClick={() => onSelectDate && onSelectDate(holiday.date)}
                    className={cn(
                      "w-full text-left flex items-start gap-2 p-1 rounded transition-colors",
                      onSelectDate ? "hover:bg-muted" : "cursor-default",
                      isSelected && "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-semibold"
                    )}
                  >
                    <span className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">
                      {dayNum} {language === "en" ? MONTHS_EN[currentMonth].slice(0, 3) : MONTHS_BN[currentMonth].slice(0, 3)}
                    </span>
                    <span className="leading-tight text-slate-700 dark:text-slate-300">
                      {language === "en" ? holiday.nameEn : holiday.nameBn}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
