"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPixel } from "@/lib/analytics/facebook/pixel";
import { trackPageView, trackCustomEvent } from "@/lib/analytics/facebook/events";
import { useAuth } from "@/hooks/useAuth";

function TrackerSub() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const isInitializedRef = useRef(false);
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    initPixel();
    isInitializedRef.current = true;
  }, []);

  useEffect(() => {
    if (!isInitializedRef.current) return;
    
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (lastPathRef.current === currentPath) return;
    
    lastPathRef.current = currentPath;
    trackPageView(user || undefined);
  }, [pathname, searchParams, user]);

  // Scroll depth tracking
  useEffect(() => {
    const reachedThresholds = new Set<number>();
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPercentage = Math.round((window.scrollY / scrollHeight) * 100);
      const thresholds = [25, 50, 75, 90];
      
      for (const threshold of thresholds) {
        if (scrollPercentage >= threshold && !reachedThresholds.has(threshold)) {
          reachedThresholds.add(threshold);
          trackCustomEvent("ScrollDepth", {
            percentage: threshold,
            path: pathname
          }, user || undefined);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, user]);

  // Time-on-page tracking
  useEffect(() => {
    const startTime = Date.now();
    const intervals = [10, 30, 60, 180]; // seconds
    const triggeredIntervals = new Set<number>();

    const intervalId = setInterval(() => {
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      
      for (const interval of intervals) {
        if (elapsedSeconds >= interval && !triggeredIntervals.has(interval)) {
          triggeredIntervals.add(interval);
          trackCustomEvent("TimeOnPage", {
            seconds: interval,
            path: pathname
          }, user || undefined);
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      const totalElapsed = Math.round((Date.now() - startTime) / 1000);
      if (totalElapsed >= 5) { // Only log if they spent at least 5 seconds
        trackCustomEvent("PageExit", {
          duration_seconds: totalElapsed,
          path: pathname
        }, user || undefined);
      }
    };
  }, [pathname, user]);

  return null;
}

export default function FacebookPixelTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerSub />
    </Suspense>
  );
}
