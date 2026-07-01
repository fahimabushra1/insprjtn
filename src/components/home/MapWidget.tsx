"use client";

import React from "react";
import { usePlaces } from "@/hooks/useMap";
import { useLanguage } from "@/providers/LanguageProvider";
import { FiMap, FiAnchor, FiCompass, FiArrowRight, FiAward } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function MapWidget() {
  const { language } = useLanguage();
  const { data: placesRes } = usePlaces(true); // Fetch featured spots only
  const featuredPlaces = placesRes?.data || [];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900">
      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        
        {/* Title Heading */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs uppercase font-black text-primary tracking-wider">
            {language === "en" ? "Explore the Wild Delta" : "সুন্দরবনকে জানুন"}
          </span>
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 md:text-4xl">
            {language === "en" ? "Sundarban Journey Timeline" : "সুন্দরবন নৌ-ভ্রমণের রুট ম্যাপ"}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {language === "en"
              ? "Follow the exact ship cruise paths from Khulna and Bagerhat down through the dense mangrove estuaries ending at the Bay of Bengal."
              : "খুলনা ও বাগেরহাট থেকে শুরু হয়ে নদী ও বনের গভীরে কটকা, কচিখালী ও দুবলার চর পর্যন্ত আমাদের পুরো যাতায়াত রুটটি দেখে নিন।"}
          </p>
        </div>

        {/* Journey Route Timeline */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 py-6 overflow-x-auto scrollbar-none border rounded-2xl bg-white dark:bg-slate-950 p-6 shadow-sm">
          {[
            { name: "Khulna", nameBn: "খুলনা", icon: "⚓", label: "Gateway" },
            { name: "Bagerhat", nameBn: "বাগেরহাট", icon: "🕌", label: "UNESCO" },
            { name: "Mongla Port", nameBn: "মংলা", icon: "🚤", label: "Boarding" },
            { name: "Karamjal", nameBn: "করমজল", icon: "🐊", label: "Breeding Spot" },
            { name: "Harbaria", nameBn: "হারবাড়িয়া", icon: "🌲", label: "Sanctuary" },
            { name: "Katka", nameBn: "কটকা", icon: "🦌", label: "Tiger Hill" },
            { name: "Dublar Char", nameBn: "দুবলার চর", icon: "🐟", label: "Bay Coast" },
          ].map((stop, idx, arr) => (
            <React.Fragment key={stop.name}>
              <div className="flex flex-col items-center text-center shrink-0 w-24">
                <span className="h-10 w-10 rounded-full bg-emerald-950/5 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-800/10 flex items-center justify-center font-black text-base shadow-sm">
                  {stop.icon}
                </span>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mt-2">
                  {language === "en" ? stop.name : stop.nameBn}
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">
                  {stop.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <span className="hidden md:block h-0.5 flex-1 bg-slate-200 dark:bg-slate-800 shrink-0 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Featured spots grid cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {featuredPlaces.slice(0, 3).map((place: any) => (
            <div key={place._id} className="group overflow-hidden rounded-2xl border bg-white dark:bg-slate-950 shadow-sm flex flex-col justify-between">
              <div>
                {place.featuredImage && (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={place.featuredImage}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-350"
                    />
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className="bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        {place.category}
                      </span>
                      {place.slug === "bagerhat" && (
                        <span className="bg-yellow-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <FiAward />
                          <span>UNESCO</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="p-5 space-y-2">
                  <h3 className="font-black text-base text-slate-800 dark:text-slate-100">
                    {language === "en" ? place.name : place.nameBn}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {place.description}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">⏱ {place.travelTime}</span>
                <Link
                  href={`/places/${place.slug}`}
                  className="text-primary hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>{language === "en" ? "Details" : "বিস্তারিত"}</span>
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action button */}
        <div className="text-center">
          <Button size="lg" asChild className="rounded-xl font-extrabold shadow-sm">
            <Link href="/map" className="flex items-center gap-1.5">
              <FiMap />
              <span>{language === "en" ? "Explore Full Interactive Map" : "ইন্টারেক্টিভ ম্যাপে পুরো রুট দেখুন"}</span>
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
