"use client";

import { useLanguage } from "@/providers/LanguageProvider";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold md:text-4xl text-foreground">
        {language === "en" ? "About Insaniat Parjatan" : "ইনসানিয়াত পর্যটন সম্পর্কে"}
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
        {language === "en"
          ? "Insaniat Parjatan is a dedicated Sundarban tourism company based in Bangladesh. We specialize in curated mangrove forest experiences — from day excursions to multi-day adventures — led by expert local guides who know the tides, trails, and wildlife of this UNESCO World Heritage site."
          : "ইনসানিয়াত পর্যটন বাংলাদেশের একটি ডেডিকেটেড সুন্দরবন পর্যটন সংস্থা। আমরা সুন্দরবনের ম্যানগ্রোভ ফরেস্টের বিভিন্ন প্যাকেজ পরিচালনা করে থাকি — ডে ট্যুর থেকে শুরু করে একাধিক দিনের ভ্রমণ পর্যন্ত — যেগুলোর দায়িত্বে থাকেন স্থানীয় দক্ষ গাইডরা যারা এই ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইটের জোয়ার-ভাটা, ট্রেইল এবং বন্যপ্রাণী সম্পর্কে বিস্তারিত জানেন।"}
      </p>
      <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
        {language === "en"
          ? "Full about page content will be expanded in a future phase."
          : "ভবিষ্যতের ধাপে আমাদের সম্পর্কে আরও বিস্তারিত তথ্য এখানে যুক্ত করা হবে।"}
      </p>
    </div>
  );
}
