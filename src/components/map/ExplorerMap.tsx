"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  useMap 
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/providers/LanguageProvider";
import { usePlaces, useRoutes } from "@/hooks/useMap";
import { 
  FiMapPin, 
  FiCompass, 
  FiAnchor, 
  FiFilter, 
  FiBookOpen, 
  FiAward,
  FiPlay,
  FiPause,
  FiNavigation
} from "react-icons/fi";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import FullPageLoader from "@/components/loaders/FullPageLoader";

// Solve default Leaflet icon hashing crash
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

// Custom Nature Themed Marker Icons
const getCustomIcon = (category: string, isHighlighted: boolean) => {
  if (typeof window === "undefined") return null;

  const color = category === "gateway" 
    ? "#022c22" // Deep Emerald for Gateway
    : isHighlighted 
    ? "#f59e0b" // Amber for Active/Selected
    : "#059669"; // Emerald for standard Spot

  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    ">
      <span style="color: white; font-size: 11px;">
        ${category === "gateway" ? "⚓" : "🌲"}
      </span>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "custom-leaflet-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Map Fly-To controller component
interface FlyToHandlerProps {
  center: [number, number] | null;
  zoom: number;
}
function FlyToHandler({ center, zoom }: FlyToHandlerProps) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function ExplorerMap() {
  const { language } = useLanguage();
  
  // Queries
  const { data: placesRes, isLoading: placesLoading } = usePlaces();
  const { data: routesRes, isLoading: routesLoading } = useRoutes();

  const places = placesRes?.data || [];
  const routes = routesRes?.data || [];

  // Local State
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>([22.1, 89.6]);
  const [mapZoom, setMapZoom] = useState<number>(9);
  
  // Filters State
  const [filterType, setFilterType] = useState<string>("all");
  
  // Boat Cruise Animation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [animatedBoatCoords, setAnimatedBoatCoords] = useState<[number, number] | null>(null);
  const animationTimer = useRef<any>(null);

  // Boat path definition: Khulna -> Bagerhat -> Mongla -> Karamjal -> Harbaria -> Katka -> Kochikhali -> Jamtala Beach -> Dimer Char -> Dublar Char -> Hiron Point -> Andharmanik -> Dobeki -> Kalagachhia
  const boatJourneyPath = [
    [22.8456, 89.5403], // Khulna
    [22.6602, 89.7895], // Bagerhat
    [22.4842, 89.6053], // Mongla
    [22.4285, 89.5910], // Karamjal
    [22.3015, 89.6134], // Harbaria
    [21.8543, 89.7824], // Katka
    [21.8492, 89.8402], // Kochikhali
    [21.8391, 89.7876], // Jamtala
    [21.8433, 89.8974], // Dimer Char
    [21.7167, 89.5833], // Dublar Char
    [21.7964, 89.4678], // Hiron Point
    [21.8906, 89.5167], // Andharmanik
    [21.8655, 89.2455], // Dobeki
    [22.2132, 89.1418], // Kalagachhia
  ];

  // Stop names mapping for boat voyage alerts
  const stopNames = [
    "Khulna", "Bagerhat", "Mongla Port", "Karamjal Center", "Harbaria camp",
    "Katka watchtower", "Kochikhali forest Clearing", "Jamtala Beach",
    "Dimer Char sandbar", "Dublar Char dryfish village", "Hiron Point Navy camp",
    "Andharmanik canal", "Dobeki canopy path", "Kalagachhia base"
  ];

  // Handle Animation Playback
  useEffect(() => {
    if (isPlaying) {
      animationTimer.current = setInterval(() => {
        setAnimationIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= boatJourneyPath.length) {
            setIsPlaying(false);
            clearInterval(animationTimer.current);
            return 0;
          }
          const coords = boatJourneyPath[nextIndex] as [number, number];
          setAnimatedBoatCoords(coords);
          setMapCenter(coords);
          setMapZoom(11);
          return nextIndex;
        });
      }, 2500);
    } else {
      if (animationTimer.current) {
        clearInterval(animationTimer.current);
      }
    }
    return () => clearInterval(animationTimer.current);
  }, [isPlaying]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setAnimatedBoatCoords(boatJourneyPath[animationIndex] as [number, number]);
      setMapCenter(boatJourneyPath[animationIndex] as [number, number]);
      setMapZoom(11);
      setIsPlaying(true);
    }
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setAnimationIndex(0);
    setAnimatedBoatCoords(null);
    setMapCenter([22.1, 89.6]);
    setMapZoom(9);
  };

  if (placesLoading || routesLoading) {
    return <FullPageLoader />;
  }

  // Filter application
  const getFilteredPlaces = () => {
    return places.filter((p: any) => {
      if (filterType === "all") return true;
      if (filterType === "gateway") return p.category === "gateway";
      if (filterType === "unesco") return p.slug === "bagerhat";
      if (filterType === "tiger") return p.wildlife?.tiger >= 4;
      if (filterType === "birds") return p.wildlife?.birds >= 4;
      if (filterType === "beach") return p.slug.includes("beach") || p.slug.includes("char");
      return true;
    });
  };

  const filteredPlaces = getFilteredPlaces();

  // Boat icon styling
  const getBoatIcon = () => {
    if (typeof window === "undefined") return null;
    return L.divIcon({
      html: `
        <div style="
          background-color: #f59e0b;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          animation: pulse 1.5s infinite;
        ">
          🚢
        </div>
      `,
      className: "boat-anim-icon",
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
  };

  const handleSpotClick = (place: any) => {
    setSelectedPlace(place);
    setMapCenter([place.latitude, place.longitude]);
    setMapZoom(11);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
      
      {/* Sidebar - Destinations Timeline & Filters */}
      <aside className="w-full lg:w-[420px] bg-white border-r flex flex-col z-10 shrink-0 h-1/2 lg:h-full shadow-md">
        {/* Title */}
        <div className="p-4 border-b bg-emerald-950 text-white flex justify-between items-center">
          <div>
            <h1 className="font-black text-base flex items-center gap-1.5">
              <FiCompass className="animate-spin-slow" />
              <span>{language === "en" ? "Sundarban Explorer Map" : "সুন্দরবন এক্সপ্লোরার ম্যাপ"}</span>
            </h1>
            <p className="text-[10px] opacity-75 mt-0.5">
              {language === "en" ? "Follow the trail from Khulna deep into the delta" : "খুলনা থেকে সুন্দরবনের শেষ সীমানা পর্যন্ত রুট"}
            </p>
          </div>
          
          {/* Boat Playback button */}
          <button
            onClick={togglePlayback}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 px-2.5 py-1 rounded-xl text-xs font-black text-slate-900 transition-colors shadow-sm"
          >
            {isPlaying ? <FiPause /> : <FiPlay />}
            <span>{isPlaying ? "Pause" : "Play Tour"}</span>
          </button>
        </div>

        {/* Filter List */}
        <div className="p-3 border-b bg-slate-50 flex gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: "all", label: language === "en" ? "All Sites" : "সব স্থান" },
            { id: "gateway", label: language === "en" ? "Gateways" : "প্রবেশদ্বার" },
            { id: "unesco", label: language === "en" ? "UNESCO" : "ইউনেস্কো" },
            { id: "tiger", label: language === "en" ? "🐅 Tigers" : "🐅 বাঘ" },
            { id: "birds", label: language === "en" ? "🦜 Birds" : "🦜 পাখি" },
            { id: "beach", label: language === "en" ? "🏖 Beaches" : "🏖 সমুদ্র সৈকত" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setFilterType(item.id);
                setSelectedPlace(null);
              }}
              className={cn(
                "px-2.5 py-1 text-[10px] font-black rounded-lg border transition-colors shrink-0",
                filterType === item.id
                  ? "bg-emerald-800 text-white border-emerald-800"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Playback Alert banner if playing */}
        {isPlaying && animatedBoatCoords && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs font-bold text-amber-950 flex items-center gap-2 animate-pulse">
            <FiNavigation className="text-amber-600 animate-bounce" />
            <span>
              {language === "en" ? `Cruising boat at: ${stopNames[animationIndex]}` : `ট্যুর বোট এখন: ${stopNames[animationIndex]} এলাকায়`}
            </span>
          </div>
        )}

        {/* Timeline Stop List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground italic">No places match this category filter.</div>
          ) : (
            filteredPlaces.map((place: any, index: number) => (
              <div
                key={place._id}
                onClick={() => handleSpotClick(place)}
                className={cn(
                  "p-3 rounded-xl border transition-all cursor-pointer flex gap-3 group relative",
                  selectedPlace?.slug === place.slug
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-sm"
                    : "border-slate-200 hover:border-slate-350 hover:bg-slate-50/80"
                )}
              >
                {/* Visual Timeline connector indicators */}
                <div className="flex flex-col items-center shrink-0">
                  <span className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center font-black text-[10px] border shadow-sm",
                    place.category === "gateway" ? "bg-emerald-950 text-white" : "bg-emerald-100 text-emerald-800"
                  )}>
                    {index + 1}
                  </span>
                  {index < filteredPlaces.length - 1 && (
                    <span className="w-0.5 h-12 bg-slate-200 dark:bg-slate-800 mt-1" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">
                      {language === "en" ? place.name : place.nameBn}
                    </h3>
                    {place.slug === "bagerhat" && (
                      <span className="shrink-0 flex items-center gap-0.5 bg-yellow-500/10 text-yellow-700 font-extrabold text-[9px] px-1 rounded border border-yellow-500/20">
                        <FiAward />
                        <span>UNESCO</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                  
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold border-t pt-1.5 mt-1 border-slate-100">
                    <span className="flex items-center gap-0.5">
                      📍 {place.distance}
                    </span>
                    <span className="flex items-center gap-0.5">
                      ⏱ {place.travelTime}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Map Content View Container */}
      <main className="flex-1 relative h-1/2 lg:h-full">
        <MapContainer
          center={mapCenter || [22.1, 89.6]}
          zoom={mapZoom}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Active coordinates FlyTo trigger handler */}
          <FlyToHandler center={mapCenter} zoom={mapZoom} />

          {/* Plot Polyline routes between places */}
          {routes.map((route: any) => (
            <Polyline
              key={route._id}
              positions={route.coordinates}
              color={
                route.transportType === "bus" 
                  ? "#92400e" // Amber brown for bus
                  : route.transportType === "walk"
                  ? "#475569" // slate for walking path
                  : "#2563eb" // Blue for cruise vessel path
              }
              weight={route.transportType === "bus" ? 3 : 4}
              dashArray={route.transportType === "walk" ? "5, 5" : undefined}
            />
          ))}

          {/* Render markers for filtered places */}
          {filteredPlaces.map((place: any) => (
            <Marker
              key={place._id}
              position={[place.latitude, place.longitude]}
              icon={getCustomIcon(place.category, selectedPlace?.slug === place.slug) as any}
              eventHandlers={{
                click: () => {
                  setSelectedPlace(place);
                  setMapCenter([place.latitude, place.longitude]);
                  setMapZoom(11);
                }
              }}
            >
              <Popup className="premium-popup-wrapper">
                <div className="w-56 overflow-hidden rounded-lg font-sans">
                  {place.featuredImage && (
                    <img
                      src={place.featuredImage}
                      alt={place.name}
                      className="w-full h-24 object-cover mb-2.5 rounded-md"
                    />
                  )}
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {language === "en" ? place.name : place.nameBn}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                  
                  {/* Bagerhat UNESCO Badge info inside popup */}
                  {place.slug === "bagerhat" && (
                    <div className="bg-yellow-500/10 text-yellow-800 text-[10px] font-bold p-1 rounded border border-yellow-500/20 my-1.5">
                      🕌 Historic Mosque City - Sixty Dome Mosque
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-800 mt-2 border-t pt-1.5 border-slate-100">
                    <span>⏱ {place.travelTime}</span>
                    <span>•</span>
                    <span>📍 {place.distance}</span>
                  </div>

                  <div className="flex gap-1.5 mt-3 border-t pt-2.5">
                    <Link
                      href={`/places/${place.slug}`}
                      className="flex-1 text-center py-1 border border-emerald-600 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors"
                    >
                      {language === "en" ? "Explore Details" : "বিস্তারিত বিবরণ"}
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Animated Boat Cruise Marker */}
          {isPlaying && animatedBoatCoords && (
            <Marker
              position={animatedBoatCoords}
              icon={getBoatIcon() as any}
              zIndexOffset={1000}
            />
          )}
        </MapContainer>

        {/* Small Bottom Sheet for mobile info view */}
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 right-4 z-20 md:left-auto md:w-80 bg-white/95 backdrop-blur-sm border border-slate-200/80 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-primary">
                  {selectedPlace.category === "gateway" ? "Entry Gateway" : "Tourist Spot"}
                </span>
                <h4 className="font-black text-base text-slate-800 leading-tight">
                  {language === "en" ? selectedPlace.name : selectedPlace.nameBn}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1 border rounded-lg bg-slate-50"
              >
                ✕
              </button>
            </div>
            
            {/* Wildlife rating inside bottom card */}
            {selectedPlace.wildlife && (selectedPlace.wildlife.tiger > 0 || selectedPlace.wildlife.birds > 0) && (
              <div className="flex gap-2 mt-2">
                {selectedPlace.wildlife.tiger > 0 && (
                  <span className="bg-red-50 text-red-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-100">
                    🐅 Tiger: {selectedPlace.wildlife.tiger}/5
                  </span>
                )}
                {selectedPlace.wildlife.birds > 0 && (
                  <span className="bg-blue-50 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                    🦜 Birds: {selectedPlace.wildlife.birds}/5
                  </span>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
              {selectedPlace.description}
            </p>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/places/${selectedPlace.slug}`}
                className="flex-1 text-center py-2 bg-emerald-950 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors shadow-sm"
              >
                {language === "en" ? "View Full Details" : "বিস্তারিত বিবরণ দেখুন"}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
