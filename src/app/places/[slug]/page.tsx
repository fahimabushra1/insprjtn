"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlaceBySlug } from "@/hooks/useMap";
import { useLanguage } from "@/providers/LanguageProvider";
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiClock, 
  FiAnchor, 
  FiCompass, 
  FiCheckCircle, 
  FiAward,
  FiBookOpen,
  FiAlertCircle
} from "react-icons/fi";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { data: placeRes, isLoading } = usePlaceBySlug(slug);
  const place = placeRes?.data;

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!place) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <FiAlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">{language === "en" ? "Destination Not Found" : "স্থানটি খুঁজে পাওয়া যায়নি"}</h2>
        <Button onClick={() => router.push(ROUTES.HOME)}>{language === "en" ? "Go Home" : "হোমে ফিরে যান"}</Button>
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
    <div className="min-h-screen bg-slate-50/50 pb-16">
      
      {/* Hero Banner */}
      <div className="relative h-64 md:h-[400px] w-full overflow-hidden">
        <img
          src={place.featuredImage || "https://images.unsplash.com/photo-1596422847122-c90a340a4c28?w=1200"}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Navigation back and Titles */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 text-white max-w-6xl mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="self-start flex items-center gap-1.5 bg-black/35 hover:bg-black/50 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border border-white/10 backdrop-blur-sm"
          >
            <FiArrowLeft />
            <span>{language === "en" ? "Back to Route Map" : "রুটে ফিরে যান"}</span>
          </button>
          
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <span className="bg-primary hover:bg-primary px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider">
                {place.category === "gateway" 
                  ? (language === "en" ? "Entry Gateway" : "প্রবেশদ্বার")
                  : (language === "en" ? "Tourist Spot" : "পর্যটন কেন্দ্র")}
              </span>
              {place.slug === "bagerhat" && (
                <span className="flex items-center gap-1 bg-yellow-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                  <FiAward />
                  <span>UNESCO Heritage</span>
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black md:text-5xl tracking-tight">
              {language === "en" ? place.name : place.nameBn}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-6xl mt-8 grid gap-8 lg:grid-cols-3">
        
        {/* Left Column (Details, history, tips) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About */}
          <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-800 border-b pb-2 flex items-center gap-2">
              <FiCompass className="text-primary" />
              <span>{language === "en" ? "Destination Overview" : "স্থান পরিচিতি"}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {place.description}
            </p>
          </div>

          {/* UNESCO / History */}
          <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-slate-800 border-b pb-2 flex items-center gap-2">
              <FiBookOpen className="text-primary" />
              <span>{language === "en" ? "History & Cultural Heritage" : "ইতিহাস ও ঐতিহ্য"}</span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              {place.history || (language === "en" ? "No historical records specified for this destination." : "এই স্থানের জন্য কোনো ঐতিহাসিক তথ্য পাওয়া যায়নি।")}
            </p>
            
            {place.slug === "bagerhat" && (
              <div className="bg-amber-50 dark:bg-emerald-950/10 border border-yellow-500/20 p-4 rounded-xl space-y-2 mt-4">
                <h4 className="font-extrabold text-sm text-yellow-800 flex items-center gap-1.5">
                  🕌 Sixty Dome Mosque City Highlight
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bagerhat represents an exceptionally complete example of early brick mosque architecture in Southeast Asia. 
                  Important sights include Khan Jahan Ali&apos;s Tomb, the Single-Dome Singar Mosque, Nine-Dome Mosque, and the Bagerhat Museum.
                </p>
              </div>
            )}
          </div>

          {/* Travel Tips list */}
          {place.tips && place.tips.length > 0 && (
            <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-800 border-b pb-2 flex items-center gap-2">
                <FiCheckCircle className="text-primary" />
                <span>{language === "en" ? "Traveler Tips & Guidelines" : "ভ্রমণকারীদের জন্য পরামর্শ ও নিয়মাবলী"}</span>
              </h2>
              <ul className="space-y-3">
                {place.tips.map((tip: string, idx: number) => (
                  <li key={idx} className="flex gap-2.5 text-sm text-slate-600 leading-relaxed">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {place.gallery && place.gallery.length > 0 && (
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-800">{language === "en" ? "Photo Gallery" : "ছবি গ্যালারি"}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {place.gallery.map((img: string, idx: number) => (
                  <div key={idx} className="h-28 md:h-36 overflow-hidden rounded-xl border bg-slate-100">
                    <img src={img} alt={`${place.name}-${idx}`} className="w-full h-full object-cover hover:scale-105 transition-all duration-350" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Travel Info, Wildlife Ratings, CTA) */}
        <div className="space-y-6">
          
          {/* Quick Travel Specs */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">{language === "en" ? "Transit Specifications" : "যাতায়াত সংক্রান্ত বিবরণ"}</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  📍 {language === "en" ? "Distance from Khulna" : "খুলনা থেকে দূরত্ব"}
                </span>
                <span className="font-black text-slate-900">{place.distance || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  ⏱ {language === "en" ? "Transit Duration" : "ভ্রমণ সময়"}
                </span>
                <span className="font-black text-slate-900">{place.travelTime || "N/A"}</span>
              </div>
              {place.boatTime && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1">
                    ⛵ {language === "en" ? "Cruising Duration" : "নৌপথের সময়"}
                  </span>
                  <span className="font-black text-slate-900">{place.boatTime}</span>
                </div>
              )}
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground font-semibold flex items-center gap-1">
                  📅 {language === "en" ? "Best Visiting Season" : "ভ্রমণের সেরা সময়"}
                </span>
                <span className="font-black text-emerald-700">{place.bestSeason || "Nov - Feb"}</span>
              </div>
            </div>
          </div>

          {/* Wildlife viewing rating bars */}
          {place.wildlife && (
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">{language === "en" ? "Wildlife Sighting Spotting" : "বন্যপ্রাণী দেখার রেটিং"}</h3>
              
              <div className="space-y-3 text-xs">
                {/* Tiger */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">🐅 {language === "en" ? "Royal Bengal Tiger" : "রয়্যাল বেঙ্গল টাইগার"}</span>
                  <div className="flex">{renderStars(place.wildlife.tiger)}</div>
                </div>

                {/* Deer */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">🦌 {language === "en" ? "Spotted Deer" : "চিত্রা হরিণ"}</span>
                  <div className="flex">{renderStars(place.wildlife.deer)}</div>
                </div>

                {/* Croc */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">🐊 {language === "en" ? "Estuarine Crocodile" : "লোনা পানির কুমির"}</span>
                  <div className="flex">{renderStars(place.wildlife.crocodile)}</div>
                </div>

                {/* Dolphin */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">🐬 {language === "en" ? "Gangetic Dolphin" : "শুশুক / ডলফিন"}</span>
                  <div className="flex">{renderStars(place.wildlife.dolphin)}</div>
                </div>

                {/* Birds */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">🦜 {language === "en" ? "Mangrove Birds" : "ম্যানগ্রোভ পাখি"}</span>
                  <div className="flex">{renderStars(place.wildlife.birds)}</div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Box */}
          <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md text-center space-y-4">
            <h4 className="font-black text-base">{language === "en" ? "Ready to explore?" : "ভ্রমণ করতে প্রস্তুত?"}</h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Our packages cover these destinations with expert guidance, launch cruises, safety, and forest permissions.
            </p>
            <Button className="w-full bg-amber-500 text-slate-900 font-extrabold hover:bg-amber-600 rounded-xl" asChild>
              <Link href={ROUTES.PACKAGES}>{language === "en" ? "Explore Packages" : "ট্যুর প্যাকেজ দেখুন"}</Link>
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
}
