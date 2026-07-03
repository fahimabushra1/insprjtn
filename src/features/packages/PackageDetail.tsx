"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiMapPin,
  FiX,
  FiChevronRight,
  FiHome,
  FiMessageSquare,
  FiUser
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/utils/format";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/providers/LanguageProvider";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import BDHolidaysCalendar from "@/components/shared/BDHolidaysCalendar";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import {
  trackViewContent,
  trackViewPackage,
  trackViewDestination,
  trackViewItinerary,
  trackBookNowClicked,
} from "@/lib/analytics/facebook/events";

export default function PackageDetail({ pkg }: any) {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const imageUrl = pkg.images?.[0];

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  // Reviews Hook
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(pkg._id);
  const createReviewMutation = useCreateReview(pkg._id);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviewsList = reviewsData?.reviews || [];
  const averageRating = reviewsData?.averageRating || 0;
  const totalReviews = reviewsData?.totalReviews || 0;

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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      errorAlert("Empty Review", "Please enter a comment message first.");
      return;
    }
    if (comment.length < 5) {
      errorAlert("Too Short", "Comment must be at least 5 characters long.");
      return;
    }

    createReviewMutation.mutate(
      { rating, comment },
      {
        onSuccess: () => {
          successAlert("Review Submitted", "Thank you for sharing your experience!");
          setComment("");
          setRating(5);
        },
        onError: (err: any) => {
          errorAlert("Submission Failed", err.message || "Failed to submit review.");
        },
      }
    );
  };

  const renderStars = (starCount: number, size = "h-4 w-4") => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar
            key={index}
            className={`${size} ${index < starCount ? "text-amber-500 fill-amber-500" : "text-slate-200"
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <article className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80">
        <Link href={ROUTES.HOME} className="flex items-center gap-1 hover:text-primary transition-colors">
          <FiHome className="h-3.5 w-3.5" />
          <span>{language === "bn" ? "হোম" : "Home"}</span>
        </Link>
        <FiChevronRight className="h-3 w-3 text-slate-400" />
        <Link href={ROUTES.PACKAGES} className="hover:text-primary transition-colors">
          {language === "bn" ? "প্যাকেজসমূহ" : "Packages"}
        </Link>
        <FiChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-foreground truncate max-w-[200px]">{pkg.title}</span>
      </nav>

      {/* Hero Header Banner */}
      <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-muted shadow-sm">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white md:p-10">
          {pkg.featured && (
            <Badge className="mb-3 bg-emerald-600 hover:bg-emerald-600 border-none text-white font-bold">
              Featured Tour
            </Badge>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{pkg.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1 font-medium">
              <FiMapPin className="text-emerald-400" /> {pkg.location}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <FiClock className="text-emerald-400" /> {pkg.duration}
            </span>
            {totalReviews > 0 && (
              <span className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-amber-400">
                ★ {averageRating} ({totalReviews} {language === "bn" ? "রিভিউ" : "reviews"})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Details column */}
        <div className="space-y-8 lg:col-span-2">
          <section className="bg-card text-card-foreground rounded-2xl border p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">About This Tour</h2>
            <p className="leading-relaxed text-muted-foreground whitespace-pre-line text-sm md:text-base">
              {pkg.description}
            </p>
          </section>

          {pkg.itinerary?.length > 0 && (
            <section className="bg-card text-card-foreground rounded-2xl border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day: any) => (
                  <div key={day.day} className="rounded-xl border p-4 bg-slate-50/50">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold">
                        Day {day.day}
                      </Badge>
                      <h3 className="font-semibold text-slate-800">{day.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{day.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {pkg.included?.length > 0 && (
              <section className="bg-card text-card-foreground rounded-2xl border p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">What&apos;s Included</h2>
                <ul className="space-y-2">
                  {pkg.included.map((item: string) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {pkg.excluded?.length > 0 && (
              <section className="bg-card text-card-foreground rounded-2xl border p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">What&apos;s Excluded</h2>
                <ul className="space-y-2">
                  {pkg.excluded.map((item: string) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiX className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {pkg.images?.length > 1 && (
            <section className="bg-card text-card-foreground rounded-2xl border p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {pkg.images.slice(1).map((img: string, i: number) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl border">
                    <Image
                      src={img}
                      alt={`${pkg.title} - ${i + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ratings & Comments section */}
          <section className="bg-card text-card-foreground rounded-2xl border p-6 shadow-sm space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiMessageSquare className="text-primary h-5 w-5" />
                <span>{language === "bn" ? "ভ্রমণকারীদের মন্তব্য ও রেটিং" : "Traveler Reviews & Comments"}</span>
              </h2>
            </div>

            {/* Ratings Overview Summary */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
              <div className="text-center sm:border-r sm:pr-8 border-slate-200">
                <div className="text-4xl font-extrabold text-slate-900">{averageRating}</div>
                <div className="flex justify-center my-1.5">{renderStars(Math.round(averageRating), "h-5 w-5")}</div>
                <div className="text-xs text-muted-foreground">
                  {totalReviews} {language === "bn" ? "রিভিউ" : "reviews"}
                </div>
              </div>
              <div className="text-sm text-muted-foreground max-w-sm text-center sm:text-left leading-relaxed">
                {language === "bn"
                  ? "আমাদের সাথে ভ্রমণকারী পর্যটকদের নিজস্ব অনুভূতি ও রেটিং। আমরা আপনাদের মতামতকে গুরুত্ব দিই।"
                  : "Authentic star ratings and comments submitted by travelers who booked this Sundarban adventure."}
              </div>
            </div>

            {/* Reviews list */}
            {reviewsLoading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-24 bg-slate-100 rounded-xl" />
                ))}
              </div>
            ) : reviewsList.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400 italic">
                {language === "bn" ? "এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি দিন!" : "No reviews have been left yet. Be the first to leave a review!"}
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 divide-y divide-slate-100">
                {reviewsList.map((review: any, index: number) => (
                  <div key={review._id} className={`pt-4 ${index === 0 ? "pt-0 border-t-0" : ""}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-emerald-600/10">
                          <AvatarImage src={review.userId?.photo} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <FiUser />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {review.userId?.name || "Deleted User"}
                          </div>
                          <div className="mt-0.5">{renderStars(review.rating, "h-3.5 w-3.5")}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-2.5 text-slate-600 text-sm italic pl-12 bg-transparent pr-4 leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Leave Review Form */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">
                {language === "bn" ? "আপনার মন্তব্য ও রেটিং দিন" : "Submit Your Comment & Rating"}
              </h3>

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4 bg-slate-50/30 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">
                      {language === "bn" ? "আপনার রেটিং সিলেক্ট করুন" : "Select Star Rating"}
                    </label>
                    <div className="flex gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className="focus:outline-none"
                        >
                          <FaStar
                            className={`h-7 w-7 transition-colors ${num <= rating ? "text-amber-500 fill-amber-500" : "text-slate-200 hover:text-amber-300"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="comment" className="text-xs font-semibold text-slate-600 block">
                      {language === "bn" ? "আপনার মন্তব্য লিখুন" : "Your Review Comment"}
                    </label>
                    <Textarea
                      id="comment"
                      rows={3}
                      placeholder={
                        language === "bn"
                          ? "আপনার ভ্রমণের অভিজ্ঞতা শেয়ার করুন..."
                          : "Describe your travel experience, guiding quality, meals..."
                      }
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="border-slate-200 bg-white text-slate-900 focus-visible:ring-emerald-600 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createReviewMutation.isPending}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl gap-2 font-bold text-xs h-9 px-5"
                  >
                    {createReviewMutation.isPending ? (
                      <>
                        <ButtonLoader className="mr-1 h-3.5 w-3.5" />
                        Posting...
                      </>
                    ) : (
                      language === "bn" ? "রিভিউ পোস্ট করুন" : "Submit Review"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center p-6 border rounded-xl bg-slate-50/50">
                  <p className="text-sm text-slate-500 mb-3">
                    {language === "bn"
                      ? "প্যাকেজটিতে রেটিং বা মন্তব্য দেওয়ার জন্য দয়া করে লগইন করুন।"
                      : "Please log in to submit a rating and leave a review comment."}
                  </p>
                  <Button size="sm" asChild>
                    <Link href={`/login?redirect=/packages/${pkg.slug}`}>
                      {language === "bn" ? "লগইন করুন" : "Log In"}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
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
