"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

import { useLanguage } from "@/providers/LanguageProvider";

export default function HeroSection() {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/30">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              {language === "en" ? "Sundarban Tourism · Bangladesh" : "সুন্দরবন পর্যটন · বাংলাদেশ"}
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              {language === "en" ? "Explore the Magic of " : "সুন্দরবনের জাদু "}
              <span className="text-primary">{language === "en" ? "Sundarban" : "অন্বেষণ করুন"}</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {language === "en"
                ? "Embark on unforgettable journeys through the world's largest mangrove forest. Expert guides, curated packages, and memories that last a lifetime."
                : "বিশ্বের বৃহত্তম ম্যানগ্রোভ বনের মধ্য দিয়ে অবিস্মরণীয় যাত্রা শুরু করুন। অভিজ্ঞ গাইড, সুসজ্জিত প্যাকেজ এবং সারাজীবনের স্মৃতি।"}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={ROUTES.PACKAGES}>
                  {language === "en" ? "View Tour Packages" : "ট্যুর প্যাকেজগুলো দেখুন"}
                  <FiArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.CONTACT}>
                  {language === "en" ? "Contact Us" : "যোগাযোগ করুন"}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
