"use client";

import { motion } from "framer-motion";
import { FiCompass, FiShield, FiUsers } from "react-icons/fi";

const features = [
  {
    icon: FiCompass,
    title: "Expert Local Guides",
    description: "Navigate the Sundarban safely with experienced guides who know every trail and tidal channel.",
  },
  {
    icon: FiShield,
    title: "Safe & Secure",
    description: "Your safety is our priority. All tours follow strict safety protocols and regulations.",
  },
  {
    icon: FiUsers,
    title: "Small Group Tours",
    description: "Intimate group sizes ensure personalized attention and a more immersive experience.",
  },
];

import { useLanguage } from "@/providers/LanguageProvider";

export default function WhyChooseUsSection() {
  const { language } = useLanguage();

  const getTranslatedFeature = (f: typeof features[0]) => {
    if (language === "bn") {
      switch (f.title) {
        case "Expert Local Guides":
          return {
            title: "দক্ষ স্থানীয় গাইড",
            description: "জোয়ার-ভাটা এবং বন্যপ্রাণী সম্পর্কে পূর্ণ ওয়াকিবহাল গাইডদের সাথে সুন্দরবন ভ্রমণ করুন নিরাপদে।"
          };
        case "Safe & Secure":
          return {
            title: "নিরাপদ ও সুরক্ষিত",
            description: "আপনার নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার। সব ভ্রমণ কঠোর নিরাপত্তা ও সরকারি বিধি মেনে পরিচালিত হয়।"
          };
        case "Small Group Tours":
          return {
            title: "ছোট গ্রুপ ট্যুর",
            description: "গ্রুপ সাইজ সীমিত রেখে প্রত্যেকের প্রতি ব্যক্তিগত মনোযোগ এবং সুন্দরবনের আসল রোমাঞ্চ নিশ্চিত করা হয়।"
          };
      }
    }
    return f;
  };

  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">
            {language === "en" ? "Why Choose Insaniat Parjatan" : "কেন ইনসানিয়াত পর্যটন বেছে নেবেন"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {language === "en" ? "Your trusted partner for Sundarban adventures" : "সুন্দরবন ভ্রমণের জন্য আপনার নির্ভরযোগ্য অংশীদার"}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const trans = getTranslatedFeature(feature);
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl border bg-card p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{trans.title}</h3>
                <p className="text-sm text-muted-foreground">{trans.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
