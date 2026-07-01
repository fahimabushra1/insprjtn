"use client";

import React from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { 
  FiThermometer, 
  FiDroplet, 
  FiWind, 
  FiCheckCircle
} from "react-icons/fi";
import { FaSun } from "react-icons/fa";

interface SeasonInfoProps {
  season: any;
}

export default function SeasonInfo({ season }: SeasonInfoProps) {
  const { language } = useLanguage();

  if (!season) {
    return (
      <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/20 bg-card p-6 text-center text-muted-foreground italic">
        {language === "en" ? "Select a month to view details" : "বিস্তারিত দেখতে একটি মাস নির্বাচন করুন"}
      </div>
    );
  }

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-sm ${i < count ? "text-yellow-500" : "text-slate-200 dark:text-slate-700"}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/20 bg-card/80 p-6 shadow-md backdrop-blur-sm space-y-6">
      {/* Month Name & General Recommendation */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-primary font-bold">
            {language === "en" ? "Season Overview" : "ঋতু পরিচিতি"}
          </span>
          <h2 className="text-2xl font-black text-emerald-950 dark:text-emerald-50">
            {language === "en" 
              ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][season.month - 1]
              : ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"][season.month - 1]}
          </h2>
        </div>
        <div className="text-right">
          <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 text-xs font-bold shadow-sm">
            {season.tourRecommendation}
          </span>
          <div className="mt-1 flex items-center justify-end gap-1">
            <span className="text-xs font-bold text-slate-500">{language === "en" ? "Score: " : "স্কোর: "}</span>
            <div className="flex">{renderStars(season.bestTimeScore)}</div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed text-muted-foreground bg-emerald-950/5 dark:bg-emerald-950/15 p-4 rounded-xl border border-emerald-950/5">
        <strong>{language === "en" ? "Summary: " : "সারসংক্ষেপ: "}</strong>
        {season.summary}
      </p>

      {/* Grid of details */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temp */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
            <FiThermometer className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold">{language === "en" ? "Temperature" : "তাপমাত্রা"}</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{season.temperature}</div>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
            <FiDroplet className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold">{language === "en" ? "Humidity" : "আর্দ্রতা"}</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{season.humidity}</div>
          </div>
        </div>

        {/* Rain */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500">
            <FaSun className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold">{language === "en" ? "Rainfall" : "বৃষ্টিপাত"}</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{season.rainfall}</div>
          </div>
        </div>

        {/* River */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-500">
            <FiWind className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold">{language === "en" ? "River Condition" : "নদী পরিস্থিতি"}</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{season.riverCondition}</div>
          </div>
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-3 border-t pt-4 border-emerald-950/5">
        <h3 className="text-xs font-black uppercase text-emerald-950 dark:text-emerald-50 mb-1">{language === "en" ? "Monthly Activity Ratings" : "মাসিক বন্যপ্রাণী ও অন্যান্য রেটিং"}</h3>
        
        {/* Tiger */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
            🐅 {language === "en" ? "Tiger Sighting Chance" : "বাঘ দেখার সম্ভাবনা"}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(season.tigerActivity)}</div>
          </div>
        </div>

        {/* Birds */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
            🦜 {language === "en" ? "Bird Watching Rating" : "পাখি দেখার রেটিং"}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(season.birdWatching)}</div>
          </div>
        </div>

        {/* Photo */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
            📸 {language === "en" ? "Photography Season" : "ফটোগ্রাফির অনুকূলতা"}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(season.photography)}</div>
          </div>
        </div>
      </div>

      {/* Forest details & Mosquitoes */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4 border-emerald-950/5 text-xs">
        <div>
          <span className="text-muted-foreground font-bold">{language === "en" ? "Forest State:" : "বনের অবস্থা:"}</span>
          <p className="font-semibold text-emerald-900 dark:text-emerald-100 mt-0.5">{season.forestCondition}</p>
        </div>
        <div>
          <span className="text-muted-foreground font-bold">{language === "en" ? "Mosquito Level:" : "মশার উপদ্রব:"}</span>
          <p className="font-semibold text-emerald-900 dark:text-emerald-100 mt-0.5">{season.mosquitoLevel}</p>
        </div>
      </div>

      {/* Clothing & Equipment */}
      <div className="space-y-3 border-t pt-4 border-emerald-950/5 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-muted-foreground flex items-center gap-1">
            <FiCheckCircle className="text-emerald-600" />
            <span>{language === "en" ? "Recommended Clothing:" : "প্রয়োজনীয় পোশাক:"}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-100 dark:border-slate-800">
            {season.recommendedClothing}
          </p>
        </div>

        <div className="space-y-1">
          <div className="font-bold text-muted-foreground flex items-center gap-1">
            <FiCheckCircle className="text-emerald-600" />
            <span>{language === "en" ? "Recommended Equipment:" : "প্রয়োজনীয় গিয়ার/সরঞ্জাম:"}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-100 dark:border-slate-800">
            {season.recommendedEquipment}
          </p>
        </div>
      </div>
    </div>
  );
}
