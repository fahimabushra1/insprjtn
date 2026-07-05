"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSearch, FiCompass, FiHelpCircle, FiFileText } from "react-icons/fi";
import { useFaqs } from "@/hooks/useFaqs";
import GallerySkeleton from "@/components/skeletons/GallerySkeleton";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  // Fetch all published FAQs
  const { data: faqsRes, isLoading, isError } = useFaqs();

  const toggleExpand = (id: string) => {
    setExpandedIndex(expandedIndex === id ? null : id);
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "General & Bookings":
        return FiHelpCircle;
      case "Travel & Forest Safety":
        return FiCompass;
      case "Preparation & Clothing":
        return FiFileText;
      default:
        return FiHelpCircle;
    }
  };

  const rawItems = faqsRes?.data?.items || [];

  // Group by category after search filter
  const filteredItems = rawItems.filter(
    (item: any) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouping
  const categoryGroups: { [key: string]: any[] } = {};
  filteredItems.forEach((item: any) => {
    const cat = item.category || "General";
    if (!categoryGroups[cat]) {
      categoryGroups[cat] = [];
    }
    categoryGroups[cat].push(item);
  });

  const categoriesList = Object.keys(categoryGroups).map((cat) => ({
    title: cat,
    icon: getCategoryIcon(cat),
    items: categoryGroups[cat],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-950/5 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-4 py-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Frequently Asked Questions
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-emerald-50 md:text-5xl">
            Have Questions? We Have <span className="text-emerald-700">Answers</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to commonly asked questions about booking, safety preparations, and what to expect on your Sundarban adventure.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-16">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-emerald-100 bg-white/80 dark:bg-card/80 shadow-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-500 transition-all text-slate-800 dark:text-slate-100 text-sm"
          />
        </div>

        {/* Loading States */}
        {isLoading ? (
          <div className="space-y-4">
            <GallerySkeleton />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive font-semibold">
            Failed to load FAQs. Please refresh the page.
          </div>
        ) : categoriesList.length === 0 ? (
          <div className="text-center py-12 bg-white/40 dark:bg-card/40 rounded-2xl border border-dashed p-8">
            <FiHelpCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Match Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We couldn&apos;t find any answers matching &quot;{searchQuery}&quot;. Please try a different query or contact us.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {categoriesList.map((category, catIdx) => {
              const CategoryIcon = category.icon;
              return (
                <div key={catIdx} className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-100/50">
                    <CategoryIcon className="h-5 w-5 text-emerald-700" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-emerald-100 tracking-tight">
                      {category.title}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {category.items.map((item: any, itemIdx: number) => {
                      const id = `${catIdx}-${itemIdx}`;
                      const isExpanded = expandedIndex === id;

                      return (
                        <div
                          key={item._id || itemIdx}
                          className="overflow-hidden rounded-2xl border border-emerald-50/50 bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow"
                        >
                          <button
                            onClick={() => toggleExpand(id)}
                            className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-800 dark:text-slate-100 hover:text-emerald-800 transition-colors"
                          >
                            <span className="text-sm md:text-base pr-4">{item.question}</span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-950/30 p-1.5 text-emerald-800 dark:text-emerald-300"
                            >
                              <FiChevronDown className="h-4 w-4" />
                            </motion.div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                              >
                                <div className="border-t border-slate-50 dark:border-emerald-950/20 bg-emerald-50/10 dark:bg-emerald-950/5 p-5 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                  <div
                                    className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm md:text-base"
                                    dangerouslySetInnerHTML={{ __html: item.answer }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export const revalidate = 300;
