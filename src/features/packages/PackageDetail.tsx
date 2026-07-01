"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiCheck, FiClock, FiMapPin, FiX } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BDHolidaysCalendar from "@/components/shared/BDHolidaysCalendar";
import {
  trackViewContent,
  trackViewPackage,
  trackViewDestination,
  trackViewItinerary,
  trackBookNowClicked,
} from "@/lib/analytics/facebook/events";

export default function PackageDetail({ pkg }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const imageUrl = pkg.images?.[0];

  useEffect(() => {
    if (pkg) {
      trackViewContent(pkg.title, pkg.category || "Sundarban Tour", pkg._id, pkg.price, user || undefined);
      trackViewPackage(pkg, user || undefined);
      trackViewDestination(pkg.location, user || undefined);
      if (pkg.itinerary && pkg.itinerary.length > 0) {
        trackViewItinerary(pkg._id, pkg.title, user || undefined);
      }
    }
  }, [pkg, user]);

  const handleBookNow = () => {
    if (pkg) {
      trackBookNowClicked(pkg._id, pkg.title, user || undefined);
    }
    if (!isAuthenticated) {
      router.push(`/login?redirect=/packages/${pkg.slug}`);
    } else {
      router.push(`/checkout?packageId=${pkg._id}`);
    }
  };

  return (
    <article>
      <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={pkg.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white md:p-10">
          {pkg.featured && (
            <Badge variant="success" className="mb-3">Featured Tour</Badge>
          )}
          <h1 className="text-3xl font-bold md:text-4xl">{pkg.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1">
              <FiMapPin /> {pkg.location}
            </span>
            <span className="flex items-center gap-1">
              <FiClock /> {pkg.duration}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-xl font-semibold">About This Tour</h2>
            <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
              {pkg.description}
            </p>
          </section>

          {pkg.itinerary?.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary">Day {day.day}</Badge>
                      <h3 className="font-medium">{day.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{day.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {pkg.included?.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">What&apos;s Included</h2>
                <ul className="space-y-2">
                  {pkg.included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {pkg.excluded?.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">What&apos;s Excluded</h2>
                <ul className="space-y-2">
                  {pkg.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiX className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {pkg.images?.length > 1 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {pkg.images.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={img}
                      alt={`${pkg.title} - ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Starting from</p>
              <p className="mb-4 text-3xl font-bold text-primary">
                {formatCurrency(pkg.price)}
              </p>
              <Separator className="my-4" />
              <p className="mb-6 text-sm text-muted-foreground">
                per person · {pkg.duration}
              </p>
              <Button className="w-full" size="lg" onClick={handleBookNow}>
                Book Now
              </Button>
              <Button variant="outline" className="mt-3 w-full" asChild>
                <Link href={ROUTES.PACKAGES}>
                  <FiArrowLeft className="mr-2" />
                  All Packages
                </Link>
              </Button>
            </div>

            <BDHolidaysCalendar />
          </div>
        </aside>
      </div>
    </article>
  );
}
