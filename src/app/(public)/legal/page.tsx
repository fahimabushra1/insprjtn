"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiShield, FiFileText, FiRefreshCw, FiCalendar } from "react-icons/fi";

type LegalTab = "terms" | "privacy" | "refunds";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<LegalTab>("terms");

  const tabs = [
    { id: "terms" as LegalTab, label: "Terms of Service", icon: FiFileText },
    { id: "privacy" as LegalTab, label: "Privacy Policy", icon: FiShield },
    { id: "refunds" as LegalTab, label: "Refund Policy", icon: FiRefreshCw },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-4 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Legal Center
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-emerald-50 md:text-5xl">
            Rules, Privacy & <span className="text-emerald-700">Policies</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Please read our terms of service, privacy regulations, and tour refund cancellation guidelines before booking.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-emerald-100/50 mb-8 overflow-x-auto gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-sm transition-all whitespace-nowrap focus:outline-none ${
                  isActive
                    ? "border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold"
                    : "border-transparent text-muted-foreground hover:text-emerald-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="bg-white dark:bg-card rounded-2xl border border-emerald-100/40 p-6 md:p-10 shadow-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-6">
          {activeTab === "terms" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-sm md:text-base"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                  <FiFileText className="text-emerald-700" /> Terms & Booking Conditions
                </h2>
                <p className="text-xs text-muted-foreground mb-4">Last Updated: July 2026</p>
                <p>
                  Welcome to Insaniat Parjatan. By accessing our platform, booking tours, or registering an account, you agree to be bound by the following terms and conditions.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-emerald-50">1. Booking & Pricing</h3>
                <p>
                  All bookings are subject to availability and final confirmation from Insaniat Parjatan. Tour prices displayed on our website are per person and subject to change without prior notice depending on forest entrance fees and fuel pricing.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-emerald-50">2. Customer Responsibilities</h3>
                <p>
                  Travelers are responsible for maintaining their own health standards suitable for wilderness travel. All travelers must strictly follow the safety instructions given by the tour guide and armed forest guards during forest walks. Insaniat Parjatan is not liable for injuries resulting from ignoring safety protocols or wandering off paths.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-emerald-50">3. Environmental Guidelines</h3>
                <p>
                  The Sundarbans is a protected UNESCO World Heritage Site. Littering, throwing plastic in rivers, making loud noises, or carrying any items that can disturb wildlife is strictly prohibited. Violators may be subject to fines from the Bangladesh Forest Department.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-emerald-50">4. Force Majeure & Weather Conditions</h3>
                <p>
                  Sundarban tours depend heavily on tide levels, weather forecasts, and permissions from the coast guard/forest department. In cases of cyclones, low-pressure storms, or force majeure events, Insaniat Parjatan reserves the right to postpone or reschedule the tour for traveler safety.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "privacy" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-sm md:text-base"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                  <FiShield className="text-emerald-700" /> Privacy & Data protection
                </h2>
                <p className="text-xs text-muted-foreground mb-4">Last Updated: July 2026</p>
                <p>
                  At Insaniat Parjatan, we respect your privacy and are committed to safeguarding the personal information you share with us.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-emerald-50">1. Information We Collect</h3>
                <p>
                  We collect information when you register an account, make a reservation, or contact us. This includes your name, email address, phone number, physical address, profile photo, and billing details (such as wallet transaction IDs).
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-emerald-50">2. How We Use Your Data</h3>
                <p>
                  Your personal data is used solely to issue official travel permits from the Bangladesh Forest Department, manage your tour reservations, handle support communications, and verify payment proofs. We never sell or share your data with third-party advertisers.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-emerald-50">3. Authentication Security</h3>
                <p>
                  Our login system uses Firebase Authentication. Your passwords are encrypted and managed directly by Google Secure Servers, ensuring high protection against unauthorized breaches.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-emerald-50">4. Image Storage</h3>
                <p>
                  Photos uploaded to our platform (e.g. profile pictures) are stored securely on Cloudinary, and only matching HTTPS URLs are stored within our MongoDB database, minimizing file exposure risks.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "refunds" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-sm md:text-base"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                  <FiRefreshCw className="text-emerald-700" /> Cancellation & Refund Rules
                </h2>
                <p className="text-xs text-muted-foreground mb-4">Last Updated: July 2026</p>
                <p>
                  Because we book permits, guide shifts, and boat cruises well in advance, we maintain a structured cancellation policy.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-xl p-4 bg-slate-50 dark:bg-emerald-950/10 space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-emerald-100 flex items-center gap-1.5 text-sm">
                    <FiCalendar className="text-emerald-700" /> Cancellation Timeline
                  </h4>
                  <ul className="list-disc pl-5 text-xs md:text-sm space-y-1">
                    <li><strong>7+ Days Prior to Tour:</strong> 100% Refund of the payment.</li>
                    <li><strong>3 to 7 Days Prior to Tour:</strong> 50% Refund.</li>
                    <li><strong>Less than 72 Hours Prior to Tour:</strong> No Refund.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 dark:text-emerald-50">How Refunds Are Processed</h3>
                  <p>
                    Once a refund request is approved, the money is returned within 3-5 business days to the original payment channel (e.g., sent back to the bKash/Nagad wallet or bank account from which the payment was initially received).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 dark:text-emerald-50">Rescheduling</h3>
                  <p>
                    Guests may request to change their departure date up to 5 days before the tour, subject to availability and a rescheduling fee of 10% of the total package value.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
